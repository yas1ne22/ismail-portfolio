const PANEL_WIDTH = 336;
const MAX_PANEL_HEIGHT = 620;
const NODE_LIMIT = 5000;
const FONT_REGULAR = { family: "Inter", style: "Regular" };
const FONT_MEDIUM = { family: "Inter", style: "Medium" };
const FONT_BOLD = { family: "Inter", style: "Bold" };

figma.showUI(__html__, { width: PANEL_WIDTH, height: 560, themeColors: true });

figma.root.setRelaunchData({ audit: "Audit handoff readiness" });

function send(message) {
  figma.ui.postMessage(message);
}

function selectionSummary() {
  const selection = figma.currentPage.selection;
  if (!selection.length) {
    return { count: 0, label: "Select a frame or choose Current page" };
  }
  if (selection.length === 1) {
    return { count: 1, label: selection[0].name || selection[0].type };
  }
  return { count: selection.length, label: `${selection.length} layers selected` };
}

function sendSelection() {
  send({ type: "selection-status", ...selectionSummary() });
}

figma.on("selectionchange", sendSelection);
sendSelection();

function layerPath(node) {
  const names = [];
  let current = node;
  while (current && current.type !== "PAGE" && current.type !== "DOCUMENT") {
    names.unshift(current.name || current.type);
    current = current.parent;
    if (names.length === 4) break;
  }
  return names.join(" / ");
}

function hasChildren(node) {
  return node && "children" in node && Array.isArray(node.children);
}

function collectNodes(roots, includeHidden) {
  const nodes = [];
  const stack = [...roots].reverse();
  let limited = false;

  while (stack.length) {
    const node = stack.pop();
    if (!node) continue;
    if (nodes.length >= NODE_LIMIT) {
      limited = true;
      break;
    }
    if (!includeHidden && "visible" in node && node.visible === false) continue;
    nodes.push(node);
    if (hasChildren(node)) {
      for (let index = node.children.length - 1; index >= 0; index -= 1) {
        stack.push(node.children[index]);
      }
    }
  }

  return { nodes, limited };
}

function finding(severity, category, title, recommendation, node) {
  return {
    severity,
    category,
    title,
    recommendation,
    path: layerPath(node)
  };
}

function isGenericName(name) {
  return /^(frame|group|rectangle|text|vector|ellipse|line|polygon|star|component|instance|section)(\s|[-_])?\d*$/i.test((name || "").trim());
}

function isLayoutContainer(node) {
  return ["FRAME", "COMPONENT", "COMPONENT_SET"].includes(node.type);
}

function looksInteractive(node) {
  return /(button|btn|cta|tap|click|close|menu|icon button|checkbox|radio|switch)/i.test(node.name || "");
}

async function auditNodes(nodes, includeHidden) {
  const results = [];

  for (const node of nodes) {
    if (isGenericName(node.name)) {
      results.push(finding(
        "medium",
        "Naming",
        "Layer name needs context",
        `Rename “${node.name}” so its purpose is clear before handoff.`,
        node
      ));
    }

    if (isLayoutContainer(node) && hasChildren(node) && node.children.length > 1 && node.layoutMode === "NONE") {
      results.push(finding(
        "medium",
        "Auto layout",
        "Container has manual layout",
        "Add Auto Layout or document why this container needs fixed positioning.",
        node
      ));
    }

    if (node.type === "INSTANCE") {
      let mainComponent = null;
      try {
        mainComponent = await node.getMainComponentAsync();
      } catch (error) {
        mainComponent = null;
      }
      if (!mainComponent) {
        results.push(finding(
          "high",
          "Components",
          "Instance has no resolvable component",
          "Reconnect or replace this instance before development begins.",
          node
        ));
      }
    }

    if (node.type === "TEXT") {
      if (!node.characters || !node.characters.trim()) {
        results.push(finding(
          "medium",
          "Typography",
          "Text layer is empty",
          "Remove the empty layer or add the intended content and state.",
          node
        ));
      } else if (node.textStyleId === "" || node.textStyleId === figma.mixed) {
        results.push(finding(
          "low",
          "Typography",
          "Text is not using one text style",
          "Apply a documented text style or confirm this exception with engineering.",
          node
        ));
      }
    }

    if (looksInteractive(node) && "width" in node && "height" in node && (node.width < 44 || node.height < 44)) {
      results.push(finding(
        "high",
        "Touch targets",
        "Interaction target is too small",
        `Increase the hit area to at least 44 × 44 px; current size is ${Math.round(node.width)} × ${Math.round(node.height)} px.`,
        node
      ));
    }

    if (includeHidden && "visible" in node && node.visible === false) {
      results.push(finding(
        "low",
        "Hidden layers",
        "Hidden layer is inside the handoff scope",
        "Confirm whether this layer is intentional, obsolete, or part of another state.",
        node
      ));
    }
  }

  const severityRank = { high: 0, medium: 1, low: 2 };
  results.sort((a, b) => severityRank[a.severity] - severityRank[b.severity]);
  return results;
}

function solid(hex) {
  const value = hex.replace("#", "");
  return [{
    type: "SOLID",
    color: {
      r: parseInt(value.slice(0, 2), 16) / 255,
      g: parseInt(value.slice(2, 4), 16) / 255,
      b: parseInt(value.slice(4, 6), 16) / 255
    }
  }];
}

function createText(content, size, font, color, width) {
  const text = figma.createText();
  text.fontName = font;
  text.characters = content;
  text.fontSize = size;
  text.lineHeight = { unit: "PERCENT", value: 140 };
  text.fills = solid(color);
  if (width) {
    text.textAutoResize = "HEIGHT";
    text.resize(width, Math.max(text.height, size * 1.4));
  }
  return text;
}

function setupAutoFrame(frame, direction, gap, padding, fill, radius) {
  frame.layoutMode = direction;
  frame.primaryAxisSizingMode = "AUTO";
  frame.counterAxisSizingMode = "AUTO";
  frame.itemSpacing = gap;
  frame.paddingTop = padding;
  frame.paddingRight = padding;
  frame.paddingBottom = padding;
  frame.paddingLeft = padding;
  frame.fills = solid(fill);
  frame.cornerRadius = radius;
  frame.clipsContent = false;
}

function addStat(label, value) {
  const card = figma.createFrame();
  setupAutoFrame(card, "VERTICAL", 7, 14, "F7F7FA", 12);
  card.layoutGrow = 1;
  card.appendChild(createText(label, 11, FONT_REGULAR, "777780"));
  card.appendChild(createText(String(value), 23, FONT_BOLD, "202126"));
  return card;
}

function addFindingRow(item) {
  const row = figma.createFrame();
  setupAutoFrame(row, "VERTICAL", 7, 16, "FFFFFF", 0);
  row.strokes = solid("E8E8ED");
  row.strokeTopWeight = 1;
  row.strokeRightWeight = 0;
  row.strokeBottomWeight = 0;
  row.strokeLeftWeight = 0;
  row.counterAxisSizingMode = "FIXED";
  row.resize(696, 80);
  row.primaryAxisSizingMode = "AUTO";

  const top = figma.createFrame();
  setupAutoFrame(top, "HORIZONTAL", 10, 0, "FFFFFF", 0);
  top.counterAxisSizingMode = "FIXED";
  top.resize(664, 24);
  top.primaryAxisSizingMode = "AUTO";

  const severityColors = {
    high: ["FDECEC", "C74444"],
    medium: ["FFF4D9", "9A6811"],
    low: ["EEF1F5", "5D6672"]
  };
  const [pillFill, pillText] = severityColors[item.severity];
  const pill = figma.createFrame();
  setupAutoFrame(pill, "HORIZONTAL", 0, 6, pillFill, 6);
  pill.paddingTop = 4;
  pill.paddingBottom = 4;
  pill.appendChild(createText(item.severity.toUpperCase(), 9, FONT_BOLD, pillText));
  top.appendChild(pill);

  const title = createText(item.title, 14, FONT_BOLD, "24252A", 430);
  title.layoutGrow = 1;
  top.appendChild(title);
  top.appendChild(createText(item.category, 10, FONT_MEDIUM, "777780"));
  row.appendChild(top);
  row.appendChild(createText(item.recommendation, 11, FONT_REGULAR, "5F6068", 664));
  row.appendChild(createText(item.path, 10, FONT_REGULAR, "8A8B94", 664));
  return row;
}

async function createReport(scopeName, nodesScanned, findings, limited) {
  await Promise.all([
    figma.loadFontAsync(FONT_REGULAR),
    figma.loadFontAsync(FONT_MEDIUM),
    figma.loadFontAsync(FONT_BOLD)
  ]);

  const report = figma.createFrame();
  report.name = `Handoff audit · ${scopeName}`;
  setupAutoFrame(report, "VERTICAL", 20, 32, "FFFFFF", 24);
  report.counterAxisSizingMode = "FIXED";
  report.resize(760, 100);
  report.primaryAxisSizingMode = "AUTO";
  report.effects = [{
    type: "DROP_SHADOW",
    color: { r: 0.08, g: 0.08, b: 0.12, a: 0.14 },
    offset: { x: 0, y: 12 },
    radius: 28,
    spread: 0,
    visible: true,
    blendMode: "NORMAL"
  }];

  report.appendChild(createText("DESIGN HANDOFF BUILT · AUDIT REPORT", 10, FONT_BOLD, "6855E8"));
  report.appendChild(createText(`${scopeName} · Handoff audit`, 26, FONT_BOLD, "202126", 696));
  const summary = limited
    ? `${nodesScanned} layers scanned · Scan limited to ${NODE_LIMIT} layers`
    : `${nodesScanned} layers scanned · Source layers were not modified`;
  report.appendChild(createText(summary, 11, FONT_REGULAR, "6C6D76", 696));

  const counts = findings.reduce((acc, item) => {
    acc[item.severity] += 1;
    return acc;
  }, { high: 0, medium: 0, low: 0 });

  const stats = figma.createFrame();
  setupAutoFrame(stats, "HORIZONTAL", 8, 0, "FFFFFF", 0);
  stats.counterAxisSizingMode = "FIXED";
  stats.resize(696, 76);
  stats.primaryAxisSizingMode = "AUTO";
  stats.appendChild(addStat("High priority", counts.high));
  stats.appendChild(addStat("Medium", counts.medium));
  stats.appendChild(addStat("Low", counts.low));
  stats.appendChild(addStat("Checks run", 6));
  report.appendChild(stats);

  report.appendChild(createText("Prioritized findings", 15, FONT_BOLD, "202126"));
  if (!findings.length) {
    const empty = figma.createFrame();
    setupAutoFrame(empty, "VERTICAL", 7, 20, "F4FBF7", 12);
    empty.counterAxisSizingMode = "FIXED";
    empty.resize(696, 80);
    empty.primaryAxisSizingMode = "AUTO";
    empty.appendChild(createText("No handoff risks found in this scope", 14, FONT_BOLD, "226243"));
    empty.appendChild(createText("Complete a final human review of behavior, accessibility, content, and engineering constraints.", 11, FONT_REGULAR, "4F6E5D", 656));
    report.appendChild(empty);
  } else {
    for (const item of findings) report.appendChild(addFindingRow(item));
  }

  report.appendChild(createText("Generated by Design Handoff Built · Review findings with design and engineering", 10, FONT_REGULAR, "8A8B94", 696));
  report.setRelaunchData({ audit: "Run another handoff audit" });
  return report;
}

function positionReport(report, roots) {
  const boxes = roots.map((node) => node.absoluteBoundingBox).filter(Boolean);
  if (boxes.length) {
    const right = Math.max(...boxes.map((box) => box.x + box.width));
    const top = Math.min(...boxes.map((box) => box.y));
    report.x = right + 120;
    report.y = top;
    return;
  }
  report.x = figma.viewport.center.x - report.width / 2;
  report.y = figma.viewport.center.y - report.height / 2;
}

async function runAudit(message) {
  const scope = message.scope === "page" ? "page" : "selection";
  const includeHidden = Boolean(message.includeHidden);
  const maximum = Math.max(10, Math.min(200, Number(message.maximum) || 60));
  const selection = figma.currentPage.selection;

  if (scope === "selection" && !selection.length) {
    throw new Error("Select at least one layer, or switch the audit scope to Current page.");
  }

  const roots = scope === "selection" ? [...selection] : [...figma.currentPage.children];
  const scopeName = scope === "selection"
    ? (selection.length === 1 ? selection[0].name : `${selection.length} selected layers`)
    : figma.currentPage.name;

  send({ type: "busy", message: "Scanning layers…" });
  const { nodes, limited } = collectNodes(roots, includeHidden);
  const allFindings = await auditNodes(nodes, includeHidden);
  const findings = allFindings.slice(0, maximum);
  const report = await createReport(scopeName, nodes.length, findings, limited);
  positionReport(report, roots);
  figma.currentPage.selection = [report];
  figma.viewport.scrollAndZoomIntoView([report]);

  const omitted = Math.max(0, allFindings.length - findings.length);
  send({
    type: "result",
    findings: findings.length,
    omitted,
    message: omitted
      ? `Report created with ${findings.length} findings; ${omitted} additional findings were omitted by the limit.`
      : `Report created with ${findings.length} finding${findings.length === 1 ? "" : "s"}.`
  });
  figma.notify("Handoff report created");
}

figma.ui.onmessage = async (message) => {
  try {
    if (message.type === "ready") {
      sendSelection();
      return;
    }
    if (message.type === "resize") {
      const height = Math.max(420, Math.min(MAX_PANEL_HEIGHT, Math.round(message.height || 560)));
      figma.ui.resize(PANEL_WIDTH, height);
      return;
    }
    if (message.type === "run-audit") {
      await runAudit(message);
    }
  } catch (error) {
    const messageText = error && error.message ? error.message : "The audit could not be completed.";
    send({ type: "error", message: messageText });
    figma.notify(messageText, { error: true });
  }
};

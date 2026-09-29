import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

// A small, self-contained scene. The card remains an actual draggable object,
// while a keyboard button offers the same scanning sequence without dragging.
export function mountScanner(host, { onSuccess, onStatus, reduced = false }) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#faf5f5");
  const camera = new THREE.PerspectiveCamera(25, 1, 0.1, 50);
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  host.replaceChildren(renderer.domElement);
  const canvas = renderer.domElement;
  canvas.style.touchAction = "none";
  canvas.setAttribute("aria-hidden", "true");
  scene.add(new THREE.AmbientLight(0xffffff, 0.85));
  const light = new THREE.DirectionalLight("#fff9e8", 2);
  light.position.set(-3, 6, 7);
  light.castShadow = true;
  light.shadow.mapSize.set(1024, 1024);
  light.shadow.camera.left = -6;
  light.shadow.camera.right = 6;
  light.shadow.camera.top = 6;
  light.shadow.camera.bottom = -6;
  light.shadow.bias = -0.0002;
  scene.add(light);
  const fill = new THREE.DirectionalLight("#e5eeff", 0.7);
  fill.position.set(4, 1, 3);
  scene.add(fill);
  const reader = new THREE.Group();
  reader.position.y = -1.12;
  reader.rotation.x = 0.22;
  scene.add(reader);
  const textures = [];
  const mat = [];
  const geos = [];
  function texture(c) {
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    textures.push(t);
    return t;
  }
  function plastic(base) {
    const c = document.createElement("canvas");
    c.width = c.height = 512;
    const x = c.getContext("2d");
    x.fillStyle = base;
    x.fillRect(0, 0, 512, 512);
    let seed = 247;
    const rand = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };
    for (let i = 0; i < 16000; i++) {
      x.fillStyle = `rgba(${rand() > 0.5 ? "255,255,245" : "93,79,44"},${rand() * 0.065})`;
      const r = rand() * 1.5 + 0.4;
      x.fillRect(rand() * 512, rand() * 512, r, r);
    }
    for (let i = 0; i < 90; i++) {
      const a = rand() * 512,
        b = rand() * 512;
      x.strokeStyle = "rgba(75,64,35,.035)";
      x.lineWidth = 0.4;
      x.beginPath();
      x.moveTo(a, b);
      x.lineTo(a + rand() * 80, b + rand() * 5);
      x.stroke();
    }
    const t = texture(c);
    const m = new THREE.MeshStandardMaterial({
      map: t,
      roughness: 0.75,
      metalness: 0.12,
      bumpMap: t,
      bumpScale: 0.005,
    });
    mat.push(m);
    return m;
  }
  const cream = plastic("#d6c9ab"),
    face = plastic("#e6d9bb"),
    edge = new THREE.MeshStandardMaterial({ color: "#39372f", roughness: 0.7 });
  mat.push(edge);
  function box(w, h, d, x, y, z, material = cream, r = 0.02, parent = reader) {
    const geo = new RoundedBoxGeometry(w, h, d, 3, r);
    geos.push(geo);
    const mesh = new THREE.Mesh(geo, material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    parent.add(mesh);
    return mesh;
  }
  box(3.2, 0.92, 0.3, 0, 0, 0.19, cream, 0.065);
  box(3.2, 0.92, 0.22, 0, 0, -0.25, cream, 0.07);
  box(3.04, 0.69, 0.06, 0, -0.06, -0.015, edge, 0.014);
  box(2.96, 0.1, 0.09, 0, 0.392, 0.285, face, 0.018);
  // The pass travels behind this physical slot edge, so the reader itself
  // hides the inserted area without cutting the ticket geometry.
  box(2.7, 0.038, 0.08, 0, 0.463, 0.315, edge, 0.008);
  box(2.96, 0.21, 0.1, 0, 0.222, 0.32, face, 0.018);
  box(0.7, 0.5, 0.1, -1.1, -0.145, 0.32, face, 0.022);
  box(0.7, 0.5, 0.1, 1.1, -0.145, 0.32, face, 0.022);
  const ventmat = new THREE.MeshStandardMaterial({
    color: "#554d38",
    roughness: 1,
  });
  mat.push(ventmat);
  for (const side of [-1, 1])
    for (let i = 0; i < 12; i++)
      box(
        0.018,
        0.013,
        0.17,
        side * (0.72 + i * 0.056),
        0.467,
        -0.22,
        ventmat,
        0.003,
      );
  box(1.46, 0.43, 0.1, 0, -0.14, 0.39, edge, 0.025);
  const screenCanvas = document.createElement("canvas");
  screenCanvas.width = 768;
  screenCanvas.height = 192;
  const screenCtx = screenCanvas.getContext("2d");
  const screenTexture = texture(screenCanvas);
  const screenMat = new THREE.MeshBasicMaterial({
    map: screenTexture,
    toneMapped: false,
  });
  mat.push(screenMat);
  const screenGeo = new THREE.PlaneGeometry(1.32, 0.33);
  geos.push(screenGeo);
  const screen = new THREE.Mesh(screenGeo, screenMat);
  screen.position.set(0, -0.14, 0.444);
  reader.add(screen);
  const ringGeo = new THREE.TorusGeometry(0.052, 0.012, 12, 32);
  geos.push(ringGeo);
  const ring = new THREE.Mesh(ringGeo, edge);
  ring.position.set(1.35, -0.14, 0.372);
  reader.add(ring);
  const ledMat = new THREE.MeshStandardMaterial({
    color: "#938e7d",
    emissive: "#938e7d",
    emissiveIntensity: 0.1,
    roughness: 0.2,
  });
  mat.push(ledMat);
  const ledGeo = new THREE.SphereGeometry(0.039, 24, 16);
  geos.push(ledGeo);
  const led = new THREE.Mesh(ledGeo, ledMat);
  led.position.set(1.35, -0.14, 0.374);
  led.scale.z = 0.32;
  reader.add(led);
  const glow = new THREE.PointLight("#ffc246", 0, 0.8);
  glow.position.set(1.35, -0.14, 0.48);
  reader.add(glow);
  let state = "ready";
  function status(s) {
    if (state === s && s !== "ready") return;
    state = s;
    const color =
      s === "success"
        ? "#42d483"
        : s === "reading"
          ? "#e6b635"
          : s === "error"
            ? "#e56852"
            : "#879081";
    screenCtx.fillStyle = "#0d100d";
    screenCtx.fillRect(0, 0, 768, 192);
    screenCtx.fillStyle = "#ffffff06";
    for (let y = 0; y < 192; y += 5) screenCtx.fillRect(0, y, 768, 1);
    screenCtx.font = '72px "MB LCD", monospace';
    screenCtx.textAlign = "center";
    screenCtx.textBaseline = "middle";
    screenCtx.letterSpacing = "9px";
    screenCtx.fillStyle = color;
    screenCtx.shadowColor = color;
    screenCtx.shadowBlur = 10;
    screenCtx.fillText(s.toUpperCase(), 384, 101);
    screenCtx.shadowBlur = 0;
    screenTexture.needsUpdate = true;
    ledMat.color.set(color);
    ledMat.emissive.set(color);
    ledMat.emissiveIntensity = s === "ready" ? 0.15 : 2;
    glow.color.set(color);
    glow.intensity = s === "ready" ? 0 : 0.65;
  }
  status("ready");
  const cardCanvas = boardingPass();
  const cardTexture = texture(cardCanvas);
  cardTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  const qatarLogo = new Image();
  qatarLogo.onload = () => {
    cardTexture.image = boardingPass(qatarLogo);
    cardTexture.needsUpdate = true;
  };
  qatarLogo.src = "/assets/qatar.jpg";
  const cardMat = new THREE.MeshPhysicalMaterial({
    map: cardTexture,
    roughness: 0.58,
    metalness: 0.025,
    clearcoat: 0.22,
    clearcoatRoughness: 0.32,
    side: THREE.DoubleSide,
    transparent: true,
    alphaTest: 0.5,
    toneMapped: false,
  });
  mat.push(cardMat);
  const cardGeo = new THREE.PlaneGeometry(4.6, 1.857, 64, 16);
  geos.push(cardGeo);
  const positions = cardGeo.attributes.position;
  const original = positions.array.slice();
  const card = new THREE.Mesh(cardGeo, cardMat);
  card.position.set(0, 0.88, 0);
  card.castShadow = true;
  scene.add(card);
  const ray = new THREE.Raycaster(),
    pointer = new THREE.Vector2(),
    dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
    world = new THREE.Vector3();
  let width = 0,
    height = 0,
    scale = 112,
    xLimit = 0.6,
    drag = null,
    done = false,
    disposed = false,
    frameId,
    autostart = 0,
    scanOrigin = null,
    inSlot = false;
  let mountTime = performance.now(),
    userInteracted = false;
  const HOVER_Y = 0.88;
  const SLOT_Y = 0.08;
  const SLOT_Z = 0.27;
  const desired = new THREE.Vector3(0, HOVER_Y, 0);
  let tilt = 0,
    curve = 0.06,
    previousX = 0;
  function resize() {
    width = host.clientWidth;
    height = host.clientHeight;
    scale = Math.min(126, (width - 40) / 4.9, (height - 100) / 4.9);
    xLimit = Math.max(0.28, width / (2 * scale) - 2.38);
    camera.aspect = width / height;
    camera.position.set(
      0,
      -25 / scale,
      height / scale / (2 * Math.tan(THREE.MathUtils.degToRad(12.5))),
    );
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
    document.documentElement.style.setProperty(
      "--reader-bottom-px",
      `${height / 2 + 1.61 * scale - 25}px`,
    );
  }
  const observer = new ResizeObserver(resize);
  observer.observe(host);
  resize();
  function pointerWorld(e) {
    const r = canvas.getBoundingClientRect();
    pointer.set(
      ((e.clientX - r.left) / r.width) * 2 - 1,
      (-(e.clientY - r.top) / r.height) * 2 + 1,
    );
    ray.setFromCamera(pointer, camera);
    dragPlane.constant = -card.position.z;
    ray.ray.intersectPlane(dragPlane, world);
    return world;
  }
  function down(e) {
    if (done) return;
    userInteracted = true;
    pointerWorld(e);
    if (!ray.intersectObject(card).length) return;
    canvas.setPointerCapture(e.pointerId);
    drag = {
      x: world.x - card.position.x,
      y: world.y - card.position.y,
      startX: e.clientX,
      startY: e.clientY,
    };
    inSlot = Math.abs(card.position.y - SLOT_Y) < 0.12;
    scanOrigin = null;
    autostart = 0;
    canvas.style.cursor = "grabbing";
    chime("tap");
  }
  function move(e) {
    pointerWorld(e);
    if (done) return;
    if (!drag) {
      canvas.style.cursor = ray.intersectObject(card).length
        ? "grab"
        : "default";
      return;
    }
    const targetX = world.x - drag.x;
    const targetY = world.y - drag.y;

    if (!inSlot) {
      if (targetY <= SLOT_Y + 0.12 && Math.abs(targetX) <= xLimit + 0.5) {
        inSlot = true;
        chime("tap");
      }
    } else {
      if (targetY > SLOT_Y + 0.25) {
        inSlot = false;
      }
    }

    if (inSlot) {
      desired.set(
        THREE.MathUtils.clamp(targetX, -xLimit, xLimit),
        SLOT_Y,
        SLOT_Z,
      );
      tilt = THREE.MathUtils.clamp(-(desired.x - previousX) * 0.65, -0.22, 0.22);
      previousX = desired.x;
      status("reading");
      onStatus("Slide the pass across the reader");

      const armThreshold = Math.min(0.6, xLimit * 0.6);
      if (scanOrigin === null && Math.abs(desired.x) >= armThreshold) {
        scanOrigin = desired.x;
      }
      const minSwipeDist = Math.min(1.5, xLimit * 1.3);
      if (
        scanOrigin !== null &&
        Math.sign(scanOrigin) !== Math.sign(desired.x) &&
        Math.abs(desired.x - scanOrigin) >= minSwipeDist
      ) {
        success();
      }
    } else {
      desired.set(
        THREE.MathUtils.clamp(targetX, -xLimit, xLimit),
        Math.max(SLOT_Y, targetY),
        0,
      );
      const p = THREE.MathUtils.clamp(
        (HOVER_Y - desired.y) / (HOVER_Y - SLOT_Y),
        0,
        1,
      );
      desired.z = SLOT_Z * (p * p);
      tilt = THREE.MathUtils.clamp(-(desired.x - previousX) * 0.65, -0.22, 0.22);
      previousX = desired.x;
      status("ready");
      onStatus("Swipe boarding pass to enter");
      scanOrigin = null;
    }
  }
  function up(e) {
    if (!drag) return;
    const moved = Math.hypot(
      e.clientX - (drag.startX ?? e.clientX),
      e.clientY - (drag.startY ?? e.clientY),
    );
    drag = null;
    inSlot = false;
    canvas.style.cursor = "grab";
    if (canvas.hasPointerCapture(e.pointerId))
      canvas.releasePointerCapture(e.pointerId);
    if (done) return;
    if (moved < 8) {
      scan();
      return;
    }
    desired.set(0, HOVER_Y, 0);
    tilt = 0;
    scanOrigin = null;
    status("ready");
    onStatus("Click or swipe boarding pass to enter");
  }
  const stopClick = (e) => e.stopPropagation();
  canvas.addEventListener("pointerdown", down);
  canvas.addEventListener("pointermove", move);
  canvas.addEventListener("pointerup", up);
  canvas.addEventListener("pointercancel", up);
  canvas.addEventListener("click", stopClick);
  let audio = null;
  function chime(kind) {
    try {
      audio ??= new (window.AudioContext || window.webkitAudioContext)();
      if (audio.state === "suspended") audio.resume();
      const notes = kind === "success" ? [1760, 2217, 2637, 3520] : [850];
      notes.forEach((freq, i) => {
        const oscillator = audio.createOscillator(),
          gain = audio.createGain(),
          at = audio.currentTime + i * 0.045;
        oscillator.type = "sine";
        oscillator.frequency.value = freq;
        gain.gain.setValueAtTime(0.0001, at);
        gain.gain.exponentialRampToValueAtTime(
          kind === "success" ? 0.025 : 0.009,
          at + 0.003,
        );
        gain.gain.exponentialRampToValueAtTime(0.0001, at + 0.12);
        oscillator.connect(gain).connect(audio.destination);
        oscillator.start(at);
        oscillator.stop(at + 0.15);
      });
    } catch {}
  }
  function success() {
    if (done) return;
    done = true;
    drag = null;
    status("success");
    chime("success");
    onSuccess();
  }
  function scan() {
    if (done || autostart) return;
    userInteracted = true;
    drag = null;
    if (reduced) {
      success();
      return;
    }
    autostart = performance.now();
    chime("tap");
  }
  let last = performance.now();
  function render(now) {
    if (disposed) return;
    frameId = requestAnimationFrame(render);
    if (document.hidden) return;
    const dt = Math.min((now - last) / 1000, 0.035);
    last = now;
    const t = now / 1000;
    if (autostart && !done) {
      const p = (now - autostart) / 1000;
      const scanLeft = -Math.min(0.72, xLimit);
      const scanRight = Math.min(0.55, xLimit);
      if (p < 0.65) {
        const q = 1 - Math.pow(1 - p / 0.65, 3);
        desired.set(scanLeft * q, HOVER_Y - (HOVER_Y - SLOT_Y) * q, SLOT_Z * q);
        tilt = -0.035 * q;
      } else if (p < 1.55) {
        status("reading");
        onStatus("Slide the pass across the reader");
        const progress = (p - 0.65) / 0.9;
        desired.set(
          scanLeft + progress * (scanRight - scanLeft),
          SLOT_Y,
          SLOT_Z,
        );
        tilt = 0.035 * Math.sin(progress * Math.PI);
      } else success();
    } else if (!drag && state === "ready" && !done) {
      let demoY = 0;
      let demoTilt = 0;
      if (!userInteracted && !reduced) {
        const elapsed = (now - mountTime) / 1000;
        if (elapsed > 1.0 && elapsed < 2.6) {
          const demoPhase = Math.sin((Math.PI * (elapsed - 1.0)) / 1.6);
          demoY = -0.22 * demoPhase;
          demoTilt = -0.04 * demoPhase;
        }
      }
      desired.set(
        reduced ? 0 : Math.sin(t * 0.5) * 0.05,
        HOVER_Y + demoY + (reduced ? 0 : Math.sin(t * 1.2) * 0.06),
        0,
      );
      tilt = demoTilt + (reduced ? 0 : Math.sin(t * 0.9) * 0.07);
    } else if (drag) {
      tilt = THREE.MathUtils.lerp(tilt, 0, dt * 8);
    }
    const smooth = 1 - Math.exp(-dt * 20);
    card.position.lerp(desired, smooth);
    const scanning =
      inSlot ||
      (autostart > 0 && !done) ||
      state === "reading" ||
      state === "success";
    const targetRoll = scanning
      ? THREE.MathUtils.clamp(tilt * 0.15, -0.02, 0.02)
      : tilt;
    const targetPitch = scanning
      ? reader.rotation.x
      : reduced
        ? 0
        : Math.sin(t * 0.7) * 0.07;
    card.rotation.z = THREE.MathUtils.lerp(card.rotation.z, targetRoll, smooth);
    card.rotation.x = THREE.MathUtils.lerp(card.rotation.x, targetPitch, smooth);
    curve = THREE.MathUtils.lerp(
      curve,
      scanning ? 0.012 : drag ? 0.1 : 0.065,
      smooth,
    );
    for (let i = 0; i < positions.count; i++) {
      const x = original[i * 3];
      positions.array[i * 3 + 2] = curve * (x * x - 0.8);
    }
    positions.needsUpdate = true;
    cardGeo.computeVertexNormals();
    renderer.render(scene, camera);
  }
  frameId = requestAnimationFrame(render);
  return {
    scan,
    dispose() {
      disposed = true;
      cancelAnimationFrame(frameId);
      observer.disconnect();
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      canvas.removeEventListener("click", stopClick);
      geos.forEach((g) => g.dispose());
      mat.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      audio?.close();
      host.replaceChildren();
    },
  };
}
function boardingPass(qatarLogo) {
  const c = document.createElement("canvas");
  c.width = 1536;
  c.height = 620;
  const ctx = c.getContext("2d");
  const ink = "#111317",
    muted = "#4e5358",
    paper = "#fcfcfb",
    silver = "#555b60",
    silverLight = "#b7bdc1",
    burgundy = "#5c0632",
    rule = "#c9c5c2";

  ctx.clearRect(0, 0, c.width, c.height);
  ctx.fillStyle = paper;
  ctx.beginPath();
  ctx.roundRect(0, 0, c.width, c.height, 30);
  ctx.fill();
  ctx.save();
  ctx.clip();
  const stock = ctx.createLinearGradient(0, 118, c.width, c.height);
  stock.addColorStop(0, "#f7f9fa");
  stock.addColorStop(0.38, paper);
  stock.addColorStop(0.72, "#eef2f4");
  stock.addColorStop(1, "#fafbfb");
  ctx.fillStyle = stock;
  ctx.fillRect(0, 118, c.width, c.height - 118);
  const header = ctx.createLinearGradient(0, 0, c.width, 0);
  header.addColorStop(0, "#4e555a");
  header.addColorStop(0.18, "#777e83");
  header.addColorStop(0.42, silverLight);
  header.addColorStop(0.57, "#70777c");
  header.addColorStop(0.82, "#aeb4b8");
  header.addColorStop(1, silver);
  ctx.fillStyle = header;
  ctx.fillRect(0, 0, c.width, 118);
  const sheen = ctx.createLinearGradient(300, 0, 980, 118);
  sheen.addColorStop(0, "#ffffff00");
  sheen.addColorStop(0.45, "#ffffff08");
  sheen.addColorStop(0.5, "#ffffff52");
  sheen.addColorStop(0.55, "#ffffff0a");
  sheen.addColorStop(1, "#ffffff00");
  ctx.fillStyle = sheen;
  ctx.fillRect(0, 0, c.width, 118);
  ctx.fillStyle = "#ffffff55";
  ctx.fillRect(0, 116, c.width, 2);

  const text = (s, x, y, size = 16, color = ink, font = "MB Sans", weight = 400) => {
    ctx.fillStyle = color;
    ctx.font = `${weight} ${size}px "${font}", sans-serif`;
    ctx.textAlign = "left";
    ctx.fillText(s, x, y);
  };
  const mono = (s, x, y, size = 16, color = ink, weight = 500) =>
    text(s, x, y, size, color, "MB Mono", weight);
  const label = (s, x, y) => mono(s.toUpperCase(), x, y, 12, muted, 500);
  const value = (s, x, y, size = 25) => text(s, x, y, size, ink, "MB Sans", 500);

  // Silver Business Class masthead, modeled on Qatar's printed pass.
  text("درجة رجال الأعمال", 46, 40, 17, "#fff", "MB Sans", 400);
  text("Business Class", 46, 78, 29, "#fff", "MB Sans", 400);
  ctx.fillStyle = "#25357b";
  ctx.beginPath();
  ctx.arc(573, 59, 28, 0, Math.PI * 2);
  ctx.fill();
  text("oneworld", 550, 64, 11, "#fff", "MB Sans", 500);
  ctx.fillStyle = "#fff";
  ctx.beginPath();
  ctx.arc(657, 58, 30, 0, Math.PI * 2);
  ctx.fill();
  if (qatarLogo?.complete) {
    ctx.drawImage(qatarLogo, 637, 38, 40, 40);
  } else {
    text("✦", 642, 72, 35, burgundy, "MB Sans", 500);
  }
  text("QATAR", 701, 58, 31, "#fff", "MB Sans", 400);
  text("AIRWAYS  القطرية", 703, 82, 13, "#fff", "MB Sans", 400);
  text("بطاقة الصعود للطائرة", 1000, 40, 16, "#fff", "MB Sans", 400);
  text("Boarding Pass", 1000, 78, 28, "#fff", "MB Sans", 400);
  mono("BUSINESS CLASS", 1240, 66, 18, "#fff", 500);

  ctx.strokeStyle = "#b8b4b1";
  ctx.lineWidth = 2;
  ctx.setLineDash([7, 8]);
  ctx.beginPath();
  ctx.moveTo(1195, 126);
  ctx.lineTo(1195, 600);
  ctx.stroke();
  ctx.setLineDash([]);

  // Vertical thermal barcode.
  let x = 49,
    seed = 891;
  while (x < 101) {
    seed = (seed * 16807) % 2147483647;
    const w = 2 + (seed % 4);
    ctx.fillStyle = ink;
    ctx.fillRect(x, 156, w, 353);
    x += w + 2 + (seed % 2);
  }
  mono("QR2026 / 01A", 42, 544, 10, muted, 500);

  // Passenger and flight information.
  label("NAME OF PASSENGER / اسم المسافر", 132, 157);
  value("ISMAIL BETTOUMI", 132, 198, 31);
  label("DEPARTURE / المغادرة", 571, 157);
  value("0835", 571, 198, 31);
  label("DATE / التاريخ", 804, 157);
  value("21 SEP", 804, 198, 31);
  mono("ALG – DOH  /  DIGITAL MARKETING JOURNEY", 132, 237, 13, muted, 500);

  ctx.strokeStyle = rule;
  ctx.lineWidth = 2;
  [354, 561, 765, 975].forEach((divider) => {
    ctx.beginPath();
    ctx.moveTo(divider, 286);
    ctx.lineTo(divider, 474);
    ctx.stroke();
  });
  const fields = [
    ["BOARDING / البوابة", "0750", 132],
    ["GATE / البوابة", "A12", 390],
    ["SEAT / المقعد", "01A", 600],
    ["FLIGHT / الرحلة", "QR", 802],
  ];
  fields.forEach(([l, v, px]) => {
    label(l, px, 303);
    value(v, px, 382, v === "QR" ? 43 : 49);
  });
  value("2026", 802, 438, 45);
  mono("SEQ–2017", 606, 453, 13, ink, 500);

  ctx.fillStyle = "#eef1f3";
  ctx.fillRect(996, 274, 164, 210);
  label("FROM", 1018, 308);
  value("ALG", 1018, 348, 31);
  label("TO", 1018, 397);
  value("DOH", 1018, 437, 31);
  mono("BUSINESS", 1018, 470, 13, burgundy, 500);

  mono("PLEASE SLIDE PASS ACROSS READER", 132, 545, 13, burgundy, 500);
  mono("A JOURNEY THROUGH DIGITAL MARKETING & GROWTH", 132, 575, 12, muted, 500);

  // Detachable passenger stub.
  mono("BUSINESS CLASS", 1231, 166, 18, ink, 500);
  value("ISMAIL", 1231, 207, 22);
  value("BETTOUMI", 1231, 235, 22);
  mono("ALG–DOH", 1231, 283, 24, ink, 500);
  label("SEAT", 1231, 337);
  value("01A", 1231, 378, 30);
  label("FLIGHT", 1366, 337);
  value("QR2026", 1366, 378, 27);
  label("DATE", 1231, 437);
  value("21 SEP", 1231, 476, 25);
  mono("SEQ 2017", 1231, 549, 13, muted, 500);

  ctx.restore();
  return c;
}

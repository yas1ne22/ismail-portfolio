globalThis.NASAQ_COMPONENTS_EN={
  "buttons": {
    "name": "Buttons",
    "desc": "Clear verbs, one primary action per decision.",
    "html": "<div class=\"row\"><button class=\"nq-button\" data-toast=\"Primary action selected\">Start a conversation </button><button class=\"nq-button secondary\" data-toast=\"Example saved\">Save</button><button class=\"nq-button brand\" data-toast=\"Brand button example\">Try Nasaq</button><button class=\"nq-button\" disabled>Unavailable</button></div>",
    "snippet": "<button class=\"nq-button\">Start a conversation</button>\n<button class=\"nq-button secondary\">Save</button>\n<button class=\"nq-button brand\">Try Nasaq</button>\n<button class=\"nq-button\" disabled>Unavailable</button>",
    "rule": "Use native disabled for unavailable actions. Tie loading to actual work, keep the label meaningful, and prevent duplicate submission.",
    "props": [
      [
        "Direction",
        "RTL / LTR",
        "Use logical layout and language-appropriate text."
      ],
      [
        "States",
        "Default / Hover / Focus / Pressed / Loading / Disabled",
        "Pinned visual specimens; live controls use native events."
      ]
    ],
    "states": [
      {
        "name": "Default",
        "html": "<button class=\"nq-button\">Start</button>"
      },
      {
        "name": "Hover",
        "html": "<button class=\"nq-button state-hover\">Start</button>"
      },
      {
        "name": "Focus",
        "html": "<button class=\"nq-button state-focus\">Start</button>"
      },
      {
        "name": "Pressed",
        "html": "<button class=\"nq-button state-pressed\">Start</button>"
      },
      {
        "name": "Loading",
        "html": "<button class=\"nq-button\" disabled aria-busy=\"true\">Saving…</button>"
      },
      {
        "name": "Disabled",
        "html": "<button class=\"nq-button\" disabled>Unavailable</button>"
      }
    ]
  },
  "inputs": {
    "name": "Inputs",
    "desc": "Persistent labels, concise help and actionable validation.",
    "html": "<form id=\"input-demo\" class=\"stack\"><div class=\"nq-field\"><label for=\"demo-email\">Email address</label><input id=\"demo-email\" class=\"nq-input\" type=\"email\" placeholder=\"you@example.com\" dir=\"ltr\" aria-describedby=\"email-help\" required><span id=\"email-help\" class=\"nq-help\">Example address. Nothing will be sent.</span></div><button class=\"nq-button\" style=\"justify-self:start\" type=\"submit\">Validate email</button><div class=\"nq-field\"><label for=\"invalid-demo\">Project name</label><input id=\"invalid-demo\" class=\"nq-input\" aria-invalid=\"true\" aria-describedby=\"invalid-help\" value=\"\"><span id=\"invalid-help\" style=\"color:var(--nq-link)\">Enter a clear project name.</span></div></form>",
    "snippet": "<div class=\"nq-field\">\n <label for=\"email\">Email address</label>\n <input id=\"email\" class=\"nq-input\" type=\"email\" dir=\"ltr\"\n        aria-describedby=\"email-help\" required>\n <span id=\"email-help\" class=\"nq-help\">Project contact address.</span>\n</div>",
    "rule": "Keep labels visible. Associate help/error messages with aria-describedby. Validate at a useful moment and preserve input after errors.",
    "props": [
      [
        "Direction",
        "RTL / LTR",
        "Use logical layout and language-appropriate text."
      ],
      [
        "States",
        "Empty / Filled / Focus / Invalid / Readonly / Disabled",
        "Pinned visual specimens; live controls use native events."
      ]
    ],
    "states": [
      {
        "name": "Empty",
        "html": "<input class=\"nq-input\" aria-label=\"Project name: empty\" placeholder=\"Project name\">"
      },
      {
        "name": "Filled",
        "html": "<input class=\"nq-input\" aria-label=\"Project name: filled\" value=\"Nasaq project\">"
      },
      {
        "name": "Focus",
        "html": "<input class=\"nq-input state-focus\" aria-label=\"Project name: focus\" value=\"Nasaq project\">"
      },
      {
        "name": "Invalid",
        "html": "<input class=\"nq-input\" aria-label=\"Project name: invalid\" aria-invalid=\"true\" aria-describedby=\"state-input-error\"><small id=\"state-input-error\" class=\"nq-error-text\">Project name is required.</small>"
      },
      {
        "name": "Readonly",
        "html": "<input class=\"nq-input\" aria-label=\"Project name: read only\" value=\"Nasaq\" readonly>"
      },
      {
        "name": "Disabled",
        "html": "<input class=\"nq-input\" aria-label=\"Project name: disabled\" disabled value=\"Unavailable\">"
      }
    ]
  },
  "select": {
    "name": "Select",
    "desc": "One choice from a compact list of named options.",
    "html": "<div class=\"nq-field\"><label for=\"assistant-select\">Assistant</label><select id=\"assistant-select\" class=\"nq-select\"><option>Writing assistant</option><option>Research assistant</option><option>Analysis assistant</option></select><span class=\"nq-help\" id=\"select-status\" role=\"status\">Current assistant: Writing assistant</span></div>",
    "snippet": "<label for=\"assistant\">Assistant</label>\n<select id=\"assistant\" class=\"nq-select\">\n <option>Writing assistant</option>\n <option>Research assistant</option>\n</select>",
    "rule": "Prefer native select for simple choices. Use a visible label and an empty prompt when no selection is required by default.",
    "props": [
      [
        "Direction",
        "RTL / LTR",
        "Use logical layout and language-appropriate text."
      ],
      [
        "States",
        "Default / Selected / Focus / Invalid / Disabled",
        "Pinned visual specimens; live controls use native events."
      ]
    ],
    "states": [
      {
        "name": "Default",
        "html": "<select class=\"nq-select\" aria-label=\"Assistant: default\"><option>Choose an assistant</option><option>Writing</option></select>"
      },
      {
        "name": "Selected",
        "html": "<select class=\"nq-select\" aria-label=\"Assistant: selected\"><option>Writing</option><option>Research</option></select>"
      },
      {
        "name": "Focus",
        "html": "<select class=\"nq-select state-focus\" aria-label=\"Assistant: focus\"><option>Writing</option></select>"
      },
      {
        "name": "Invalid",
        "html": "<select class=\"nq-select\" aria-label=\"Assistant: invalid\" aria-invalid=\"true\" aria-describedby=\"state-select-error\"><option>Choose an assistant</option></select><small id=\"state-select-error\" class=\"nq-error-text\">Choose an assistant.</small>"
      },
      {
        "name": "Disabled",
        "html": "<select class=\"nq-select\" aria-label=\"Assistant: disabled\" disabled><option>Unavailable</option></select>"
      }
    ]
  },
  "checkbox": {
    "name": "Checkbox",
    "desc": "Independent choices and explicit mixed selection.",
    "html": "<fieldset style=\"border:0;padding:0\"><legend>Research sources</legend><label class=\"nq-check\"><input type=\"checkbox\" checked> Attached documents</label><label class=\"nq-check\"><input type=\"checkbox\"> Team library</label><label class=\"nq-check\"><input type=\"checkbox\" disabled> Archive: unavailable</label></fieldset>",
    "snippet": "<fieldset>\n <legend>Research sources</legend>\n <label class=\"nq-check\"><input type=\"checkbox\" checked> Documents</label>\n <label class=\"nq-check\"><input type=\"checkbox\"> Team library</label>\n</fieldset>",
    "rule": "Use a native checkbox. Set its indeterminate property for mixed state; give every choice a stable label.",
    "props": [
      [
        "Direction",
        "RTL / LTR",
        "Use logical layout and language-appropriate text."
      ],
      [
        "States",
        "Unchecked / Checked / Mixed / Focus / Disabled",
        "Pinned visual specimens; live controls use native events."
      ]
    ],
    "states": [
      {
        "name": "Unchecked",
        "html": "<label class=\"nq-check\"><input type=\"checkbox\"> Documents</label>"
      },
      {
        "name": "Checked",
        "html": "<label class=\"nq-check\"><input type=\"checkbox\" checked> Documents</label>"
      },
      {
        "name": "Mixed",
        "html": "<label class=\"nq-check\"><input type=\"checkbox\" data-indeterminate> Some documents</label>"
      },
      {
        "name": "Focus",
        "html": "<label class=\"nq-check\"><input type=\"checkbox\" class=\"state-focus\"> Documents</label>"
      },
      {
        "name": "Disabled",
        "html": "<label class=\"nq-check\"><input type=\"checkbox\" checked disabled> Documents</label>"
      }
    ]
  },
  "switch": {
    "name": "Switch",
    "desc": "A setting that changes immediately.",
    "html": "<label class=\"nq-check\"><input class=\"nq-switch\" type=\"checkbox\" role=\"switch\" checked> Save conversation history</label><label class=\"nq-check\"><input class=\"nq-switch\" type=\"checkbox\" role=\"switch\"> Usage notifications</label><label class=\"nq-check\"><input class=\"nq-switch\" type=\"checkbox\" role=\"switch\" disabled> Team sync: unavailable</label>",
    "snippet": "<label class=\"nq-check\">\n <input class=\"nq-switch\" type=\"checkbox\" role=\"switch\" checked>\n Save conversation history\n</label>",
    "rule": "Use a native checkbox with role=\"switch\" and a stable label. Test click, Space, on/off, disabled, RTL and LTR; keep the label target at least 44px.",
    "props": [
      [
        "Direction",
        "RTL / LTR",
        "Use logical layout and language-appropriate text."
      ],
      [
        "States",
        "Off / On / Focus / Disabled / off / Disabled / on / LTR",
        "Pinned visual specimens; live controls use native events."
      ]
    ],
    "states": [
      {
        "name": "Off",
        "html": "<label class=\"nq-check\"><input class=\"nq-switch\" role=\"switch\" type=\"checkbox\"> Saving</label>"
      },
      {
        "name": "On",
        "html": "<label class=\"nq-check\"><input class=\"nq-switch\" role=\"switch\" type=\"checkbox\" checked> Saving</label>"
      },
      {
        "name": "Focus",
        "html": "<label class=\"nq-check\"><input class=\"nq-switch state-focus\" role=\"switch\" type=\"checkbox\" checked> Saving</label>"
      },
      {
        "name": "Disabled / off",
        "html": "<label class=\"nq-check\"><input class=\"nq-switch\" role=\"switch\" type=\"checkbox\" disabled> Saving</label>"
      },
      {
        "name": "Disabled / on",
        "html": "<label class=\"nq-check\"><input class=\"nq-switch\" role=\"switch\" type=\"checkbox\" checked disabled> Saving</label>"
      },
      {
        "name": "LTR",
        "html": "<label class=\"nq-check\" dir=\"ltr\"><input class=\"nq-switch\" role=\"switch\" type=\"checkbox\" checked> Save history</label>"
      }
    ]
  },
  "tabs": {
    "name": "Tabs",
    "desc": "Related content panels within one context.",
    "html": "<div data-tabs><div class=\"nq-tabs\" role=\"tablist\" aria-label=\"Project content\"><button id=\"t1\" role=\"tab\" aria-selected=\"true\" aria-controls=\"p1\">Overview</button><button id=\"t2\" role=\"tab\" aria-selected=\"false\" aria-controls=\"p2\" tabindex=\"-1\">Documents</button><button id=\"t3\" role=\"tab\" aria-selected=\"false\" aria-controls=\"p3\" tabindex=\"-1\">Settings</button></div><div id=\"p1\" role=\"tabpanel\" aria-labelledby=\"t1\" tabindex=\"0\"><p>Every project idea in one place.</p></div><div id=\"p2\" role=\"tabpanel\" aria-labelledby=\"t2\" tabindex=\"0\" hidden><p>No documents yet. Add your first file.</p></div><div id=\"p3\" role=\"tabpanel\" aria-labelledby=\"t3\" tabindex=\"0\" hidden><p>Set the project name and conversation retention preferences.</p></div></div>",
    "snippet": "<div data-tabs>\n <div class=\"nq-tabs\" role=\"tablist\" aria-label=\"Project\">\n  <button id=\"t1\" role=\"tab\" aria-selected=\"true\" aria-controls=\"p1\">Overview</button>\n  <button id=\"t2\" role=\"tab\" aria-selected=\"false\" aria-controls=\"p2\" tabindex=\"-1\">Documents</button>\n </div>\n <div id=\"p1\" role=\"tabpanel\" aria-labelledby=\"t1\">Summary</div>\n <div id=\"p2\" role=\"tabpanel\" aria-labelledby=\"t2\" hidden>Files</div>\n</div>\n<script src=\"nasaq.js\"></script>",
    "rule": "Keep role=tablist, tab and tabpanel linked with aria-controls/labelledby. Support arrows, Home and End; account for writing direction.",
    "props": [
      [
        "Direction",
        "RTL / LTR",
        "Use logical layout and language-appropriate text."
      ],
      [
        "States",
        "Unselected / Selected / Focus / Disabled",
        "Pinned visual specimens; live controls use native events."
      ]
    ],
    "states": [
      {
        "name": "Unselected",
        "html": "<span class=\"nq-tab-sample\">Documents</span>"
      },
      {
        "name": "Selected",
        "html": "<span class=\"nq-tab-sample selected\">Overview</span>"
      },
      {
        "name": "Focus",
        "html": "<span class=\"nq-tab-sample selected state-focus\">Overview</span>"
      },
      {
        "name": "Disabled",
        "html": "<span class=\"nq-tab-sample disabled\">Archive: unavailable</span>"
      }
    ]
  },
  "badge": {
    "name": "Badge",
    "desc": "A small written status, category or count.",
    "html": "<div class=\"row\"><span class=\"nq-badge\">✦ Writing assistant</span><span class=\"nq-badge success\">● Available</span><span class=\"nq-badge error\">! Connection failed</span><span class=\"nq-badge\" style=\"background:#FFD45C\">Under review</span></div>",
    "snippet": "<span class=\"nq-badge\">Writing assistant</span>\n<span class=\"nq-badge success\">Available</span>\n<span class=\"nq-badge error\">Connection failed</span>",
    "rule": "Badges communicate status without acting like buttons. Include a written label; do not rely on color alone.",
    "props": [
      [
        "Direction",
        "RTL / LTR",
        "Use logical layout and language-appropriate text."
      ],
      [
        "States",
        "Neutral / Success / Warning / Error",
        "Pinned visual specimens; live controls use native events."
      ]
    ],
    "states": [
      {
        "name": "Neutral",
        "html": "<span class=\"nq-badge\">Assistant</span>"
      },
      {
        "name": "Success",
        "html": "<span class=\"nq-badge success\">Available</span>"
      },
      {
        "name": "Warning",
        "html": "<span class=\"nq-badge warning\">Under review</span>"
      },
      {
        "name": "Error",
        "html": "<span class=\"nq-badge error\">Connection failed</span>"
      }
    ]
  },
  "avatar": {
    "name": "Avatar",
    "desc": "A person or assistant with a dependable fallback.",
    "html": "<div class=\"row\"><span class=\"nq-avatar\" role=\"img\" aria-label=\"Sarah Ahmed\">SA</span><span class=\"nq-avatar large\" role=\"img\" aria-label=\"Mohammed Ali\">MA</span><span class=\"nq-avatar square\" role=\"img\" aria-label=\"Nasaq assistant\">✦</span><div><b>Sarah Ahmed</b><br><small class=\"nq-help\">Content team</small></div></div>",
    "snippet": "<span class=\"nq-avatar\" role=\"img\" aria-label=\"Sarah Ahmed\">SA</span>\n<span class=\"nq-avatar square\" role=\"img\" aria-label=\"Assistant\">✦</span>",
    "rule": "If the adjacent name repeats the identity, mark the avatar decorative. Provide an accessible label when the image carries meaning.",
    "props": [
      [
        "Direction",
        "RTL / LTR",
        "Use logical layout and language-appropriate text."
      ],
      [
        "States",
        "Initials / Assistant / Fallback / Online",
        "Pinned visual specimens; live controls use native events."
      ]
    ],
    "states": [
      {
        "name": "Initials",
        "html": "<span class=\"nq-avatar\" aria-hidden=\"true\">SA</span>"
      },
      {
        "name": "Assistant",
        "html": "<span class=\"nq-avatar square\" aria-hidden=\"true\">✦</span>"
      },
      {
        "name": "Fallback",
        "html": "<span class=\"nq-avatar\" aria-hidden=\"true\">?</span>"
      },
      {
        "name": "Online",
        "html": "<span class=\"nq-avatar\" aria-hidden=\"true\">SA</span> <span class=\"nq-badge success\">Online</span>"
      }
    ]
  },
  "dialog": {
    "name": "Dialog",
    "desc": "A focused decision with a clear way out.",
    "html": "<button class=\"nq-button\" data-open=\"demo-dialog\">Open dialog</button>",
    "snippet": "<button data-open=\"new-chat\">New conversation</button>\n<dialog id=\"new-chat\" class=\"nq-dialog\" aria-labelledby=\"dialog-title\">\n <h2 id=\"dialog-title\">New conversation?</h2>\n <p>The previous conversation will stay in history.</p>\n <button class=\"nq-button\" data-close=\"new-chat\">Start</button>\n <button class=\"nq-button secondary\" data-close=\"new-chat\">Cancel</button>\n</dialog>\n<script src=\"nasaq.js\"></script>",
    "rule": "Use native dialog.showModal(). Preserve a labelled heading, Escape dismissal, focus containment and focus return. Destructive decisions need clear consequences.",
    "props": [
      [
        "Direction",
        "RTL / LTR",
        "Use logical layout and language-appropriate text."
      ],
      [
        "States",
        "Closed / Open / visual / Destructive / visual",
        "Pinned visual specimens; live controls use native events."
      ]
    ],
    "states": [
      {
        "name": "Closed",
        "html": "<button class=\"nq-button secondary\" data-open=\"demo-dialog\">Open dialog</button>"
      },
      {
        "name": "Open / visual",
        "html": "<div class=\"nq-dialog-sample\"><b>New conversation?</b><p>The previous conversation will stay in history.</p><button class=\"nq-button small\" data-toast=\"Visual dialog specimen\">Start</button></div>"
      },
      {
        "name": "Destructive / visual",
        "html": "<div class=\"nq-dialog-sample\"><b>Delete draft?</b><p>This cannot be undone.</p><button class=\"nq-button secondary small\" data-toast=\"Local preview only\">Cancel</button></div>"
      }
    ]
  },
  "tooltip": {
    "name": "Tooltip",
    "desc": "Supplementary help on hover and keyboard focus.",
    "html": "<div class=\"nq-tooltip-wrap\"><button class=\"nq-button secondary\" aria-describedby=\"copy-tip\">Copy response ⧉</button><span class=\"nq-tooltip\" id=\"copy-tip\" role=\"tooltip\">Copy text to clipboard</span></div>",
    "snippet": "<span class=\"nq-tooltip-wrap\">\n <button class=\"nq-button secondary\" aria-describedby=\"copy-tip\">Copy response</button>\n <span class=\"nq-tooltip\" id=\"copy-tip\" role=\"tooltip\">Copy text to clipboard</span>\n</span>\n<script src=\"nasaq.js\"></script>",
    "rule": "Keep essential instructions in visible text. Link with aria-describedby, reveal on focus and hover, and allow Escape to dismiss.",
    "props": [
      [
        "Direction",
        "RTL / LTR",
        "Use logical layout and language-appropriate text."
      ],
      [
        "States",
        "Hidden / Hover / visible / Focus / visible",
        "Pinned visual specimens; live controls use native events."
      ]
    ],
    "states": [
      {
        "name": "Hidden",
        "html": "<span class=\"nq-tooltip-wrap\"><button class=\"nq-button secondary\" aria-describedby=\"tip-state1\">Copy</button><span class=\"nq-tooltip\" id=\"tip-state1\" role=\"tooltip\">Copy response</span></span>"
      },
      {
        "name": "Hover / visible",
        "html": "<span class=\"nq-tooltip-wrap state-tip\"><button class=\"nq-button secondary\" aria-describedby=\"tip-state2\">Copy</button><span class=\"nq-tooltip\" id=\"tip-state2\" role=\"tooltip\">Copy response</span></span>"
      },
      {
        "name": "Focus / visible",
        "html": "<span class=\"nq-tooltip-wrap state-tip\"><button class=\"nq-button secondary state-focus\" aria-describedby=\"tip-state3\">Copy</button><span class=\"nq-tooltip\" id=\"tip-state3\" role=\"tooltip\">Copy response</span></span>"
      }
    ]
  },
  "radio": {
    "name": "Radio",
    "desc": "Exactly one choice from mutually exclusive alternatives.",
    "html": "<fieldset class=\"nq-radio-group\"><legend>Assistant style</legend><label class=\"nq-check\"><input type=\"radio\" name=\"assistant-tone\" checked> Direct</label><label class=\"nq-check\"><input type=\"radio\" name=\"assistant-tone\"> Detailed</label><label class=\"nq-check\"><input type=\"radio\" name=\"assistant-tone\" disabled> Custom: unavailable</label></fieldset>",
    "snippet": "<fieldset class=\"nq-radio-group\">\n <legend>Assistant style</legend>\n <label class=\"nq-check\"><input type=\"radio\" name=\"tone\" value=\"direct\" checked> Direct</label>\n <label class=\"nq-check\"><input type=\"radio\" name=\"tone\" value=\"detailed\"> Detailed</label>\n</fieldset>",
    "rule": "Use a fieldset and legend with a shared name. Native arrow keys and Space should select choices. Radios select, rather than execute an action.",
    "props": [
      [
        "Direction",
        "RTL / LTR",
        "Use logical layout and language-appropriate text."
      ],
      [
        "States",
        "Unchecked / Checked / Focus / Disabled",
        "Pinned visual specimens; live controls use native events."
      ]
    ],
    "states": [
      {
        "name": "Unchecked",
        "html": "<label class=\"nq-check\"><input type=\"radio\" name=\"state-radio\"> Direct</label>"
      },
      {
        "name": "Checked",
        "html": "<label class=\"nq-check\"><input type=\"radio\" name=\"state-radio\" checked> Detailed</label>"
      },
      {
        "name": "Focus",
        "html": "<label class=\"nq-check\"><input class=\"state-focus\" type=\"radio\" name=\"state-radio-focus\"> Direct</label>"
      },
      {
        "name": "Disabled",
        "html": "<label class=\"nq-check\"><input type=\"radio\" disabled> Custom</label>"
      }
    ]
  },
  "textarea": {
    "name": "Textarea",
    "desc": "Long instructions with room to grow.",
    "html": "<div class=\"nq-field\"><label for=\"long-prompt\">Assistant instructions</label><textarea id=\"long-prompt\" class=\"nq-input nq-textarea\" rows=\"4\" maxlength=\"500\" aria-describedby=\"long-help\" placeholder=\"Describe the task, audience and tone…\"></textarea><span id=\"long-help\" class=\"nq-help\">Up to 500 characters. This draft is not sent.</span></div>",
    "snippet": "<label for=\"prompt\">Assistant instructions</label>\n<textarea id=\"prompt\" class=\"nq-input nq-textarea\" rows=\"4\" maxlength=\"500\" aria-describedby=\"prompt-help\"></textarea>\n<p id=\"prompt-help\" class=\"nq-help\">Up to 500 characters.</p>",
    "rule": "Allow vertical resizing, explain limits before input, and preserve drafts. Keep a visible label and associated help text.",
    "props": [
      [
        "Direction",
        "RTL / LTR",
        "Use logical layout and language-appropriate text."
      ],
      [
        "States",
        "Empty / Filled / Focus / Invalid / Disabled",
        "Pinned visual specimens; live controls use native events."
      ]
    ],
    "states": [
      {
        "name": "Empty",
        "html": "<textarea class=\"nq-input nq-textarea\" aria-label=\"Instructions: empty\" rows=\"2\" placeholder=\"Your instructions…\"></textarea>"
      },
      {
        "name": "Filled",
        "html": "<textarea class=\"nq-input nq-textarea\" aria-label=\"Instructions: filled\" rows=\"2\">Write a clear first draft.</textarea>"
      },
      {
        "name": "Focus",
        "html": "<textarea class=\"nq-input nq-textarea state-focus\" aria-label=\"Instructions: focus\" rows=\"2\">Project draft</textarea>"
      },
      {
        "name": "Invalid",
        "html": "<textarea class=\"nq-input nq-textarea\" aria-label=\"Instructions: invalid\" aria-invalid=\"true\" rows=\"2\" aria-describedby=\"state-text-error\"></textarea><small id=\"state-text-error\" class=\"nq-error-text\">Describe the task.</small>"
      },
      {
        "name": "Disabled",
        "html": "<textarea class=\"nq-input nq-textarea\" aria-label=\"Instructions: disabled\" rows=\"2\" disabled>Unavailable</textarea>"
      }
    ]
  },
  "alert": {
    "name": "Alert",
    "desc": "A useful message that describes what happened and what to do.",
    "html": "<div class=\"nq-alert success\"><b>Draft saved.</b><p>Return to it from the project.</p></div><div class=\"nq-alert error\" style=\"margin-top:16px\"><b>Could not connect.</b><p>Your message was kept. Try again.</p><button class=\"nq-button secondary\" data-toast=\"Local retry example\">Retry</button></div>",
    "snippet": "<div class=\"nq-alert error\" role=\"alert\">\n <b>Could not connect.</b><p>Your message was kept.</p>\n <button class=\"nq-button secondary\">Retry</button>\n</div>",
    "rule": "Use a written status and a clear recovery action. Reserve role=alert for urgent updates; avoid announcing static page content repeatedly.",
    "props": [
      [
        "Direction",
        "RTL / LTR",
        "Use logical layout and language-appropriate text."
      ],
      [
        "States",
        "Info / Success / Warning / Error",
        "Pinned visual specimens; live controls use native events."
      ]
    ],
    "states": [
      {
        "name": "Info",
        "html": "<div class=\"nq-alert\">New sources are available.</div>"
      },
      {
        "name": "Success",
        "html": "<div class=\"nq-alert success\">Saved.</div>"
      },
      {
        "name": "Warning",
        "html": "<div class=\"nq-alert warning\">You are approaching your usage limit.</div>"
      },
      {
        "name": "Error",
        "html": "<div class=\"nq-alert error\">Could not save. Try again.</div>"
      }
    ]
  },
  "progress": {
    "name": "Progress",
    "desc": "Real progress with a stated value or an honest indeterminate state.",
    "html": "<label for=\"usage-progress\">Quota used: 28%</label><progress id=\"usage-progress\" class=\"nq-progress\" max=\"100\" value=\"28\">28%</progress><label for=\"upload-progress\">Indeterminate progress: uploading</label><progress id=\"upload-progress\" class=\"nq-progress\">Uploading</progress>",
    "snippet": "<label for=\"usage\">Quota used: 28%</label>\n<progress id=\"usage\" class=\"nq-progress\" max=\"100\" value=\"28\">28%</progress>",
    "rule": "Set value and max only when progress is known. Give the control a label. Omit value for indeterminate work and stop when finished or failed.",
    "props": [
      [
        "Direction",
        "RTL / LTR",
        "Use logical layout and language-appropriate text."
      ],
      [
        "States",
        "Empty / Active / Complete / Indeterminate",
        "Pinned visual specimens; live controls use native events."
      ]
    ],
    "states": [
      {
        "name": "Empty",
        "html": "<label>0%<progress class=\"nq-progress\" value=\"0\" max=\"100\">0%</progress></label>"
      },
      {
        "name": "Active",
        "html": "<label>45%<progress class=\"nq-progress\" value=\"45\" max=\"100\">45%</progress></label>"
      },
      {
        "name": "Complete",
        "html": "<label>100%<progress class=\"nq-progress\" value=\"100\" max=\"100\">100%</progress></label>"
      },
      {
        "name": "Indeterminate",
        "html": "<label>Uploading<progress class=\"nq-progress\">Uploading</progress></label>"
      }
    ]
  },
  "skeleton": {
    "name": "Skeleton",
    "desc": "Temporary geometry while actual content loads.",
    "html": "<div aria-busy=\"true\" aria-label=\"Loading project card\"><div class=\"nq-skeleton\" style=\"width:44px;height:44px;border-radius:50%\"></div><div class=\"nq-skeleton\" style=\"width:65%;margin-top:16px\"></div><div class=\"nq-skeleton\" style=\"width:90%;margin-top:8px\"></div><span class=\"nq-help\">Loading project…</span></div>",
    "snippet": "<section aria-busy=\"true\" aria-label=\"Loading\">\n <div class=\"nq-skeleton\" aria-hidden=\"true\"></div>\n <span class=\"nq-help\">Loading project…</span>\n</section>",
    "rule": "Keep skeletons decorative, mark the content region aria-busy during work, and expose a textual status. Respect reduced motion and show a recoverable error.",
    "props": [
      [
        "Direction",
        "RTL / LTR",
        "Use logical layout and language-appropriate text."
      ],
      [
        "States",
        "Loading / Reduced motion / Loaded / Error",
        "Pinned visual specimens; live controls use native events."
      ]
    ],
    "states": [
      {
        "name": "Loading",
        "html": "<div class=\"nq-skeleton\" aria-hidden=\"true\"></div><small>Loading…</small>"
      },
      {
        "name": "Reduced motion",
        "html": "<div class=\"nq-skeleton static\" aria-hidden=\"true\"></div><small>No animation</small>"
      },
      {
        "name": "Loaded",
        "html": "<b>Writing project</b><p>Content is ready.</p>"
      },
      {
        "name": "Error",
        "html": "<div class=\"nq-alert error\">Could not load the project.</div>"
      }
    ]
  },
  "accordion": {
    "name": "Accordion",
    "desc": "Optional detail without losing reading order.",
    "html": "<div class=\"nq-faq\"><details open><summary>How is a conversation saved?</summary><p>This is a design example. Your product defines retention duration and settings.</p></details><details><summary>How do I delete data?</summary><p>Provide a clear deletion flow with appropriate confirmation.</p></details></div>",
    "snippet": "<div class=\"nq-faq\">\n <details><summary>How does it work?</summary><p>Clear details.</p></details>\n</div>",
    "rule": "Prefer native details/summary. Keep headings and key decisions visible outside collapsed content. Do not use fabricated disabled states.",
    "props": [
      [
        "Direction",
        "RTL / LTR",
        "Use logical layout and language-appropriate text."
      ],
      [
        "States",
        "Collapsed / Expanded / Focus",
        "Pinned visual specimens; live controls use native events."
      ]
    ],
    "states": [
      {
        "name": "Collapsed",
        "html": "<details class=\"nq-accordion\"><summary>Details</summary><p>Additional content.</p></details>"
      },
      {
        "name": "Expanded",
        "html": "<details class=\"nq-accordion\" open><summary>Details</summary><p>Additional content.</p></details>"
      },
      {
        "name": "Focus",
        "html": "<details class=\"nq-accordion\"><summary class=\"state-focus\">Details</summary><p>Additional content.</p></details>"
      }
    ]
  },
  "cards": {
    "name": "Cards",
    "desc": "A coherent content unit with an action in context.",
    "html": "<article class=\"nq-card\"><span class=\"nq-badge\">Assistant</span><h3>Writing assistant</h3><p>A draft closer to your voice.</p><button class=\"nq-button secondary\" data-toast=\"Local assistant card example\">Explore assistant</button></article>",
    "snippet": "<article class=\"nq-card\">\n <h3>Writing assistant</h3><p>A draft closer to your voice.</p>\n <a class=\"nq-button secondary\" href=\"/assistant/writing\">Explore assistant</a>\n</article>",
    "rule": "Use article for content. Make actions native links/buttons, avoiding nested interactive controls. Support empty, loading and error content.",
    "props": [
      [
        "Direction",
        "RTL / LTR",
        "Use logical layout and language-appropriate text."
      ],
      [
        "States",
        "Default / Hover / Focus action / Empty / Loading",
        "Pinned visual specimens; live controls use native events."
      ]
    ],
    "states": [
      {
        "name": "Default",
        "html": "<article class=\"nq-card\"><b>Writing assistant</b><p>A clear first draft.</p></article>"
      },
      {
        "name": "Hover",
        "html": "<article class=\"nq-card state-hover\"><b>Writing assistant</b><p>An action in context.</p></article>"
      },
      {
        "name": "Focus action",
        "html": "<article class=\"nq-card\"><b>Writing assistant</b><button class=\"nq-button small state-focus\" data-toast=\"Local example\">Explore</button></article>"
      },
      {
        "name": "Empty",
        "html": "<article class=\"nq-card\"><b>No files yet.</b><p>Add your first file.</p></article>"
      },
      {
        "name": "Loading",
        "html": "<article class=\"nq-card\" aria-busy=\"true\"><div class=\"nq-skeleton\" aria-hidden=\"true\"></div><small>Loading…</small></article>"
      }
    ]
  },
  "breadcrumb": {
    "name": "Breadcrumb",
    "desc": "A location trail through a real hierarchy.",
    "html": "<nav class=\"nq-breadcrumb\" aria-label=\"Breadcrumb\"><a href=\"#overview\">Nasaq</a><span aria-hidden=\"true\">/</span><a href=\"#patterns\">Projects</a><span aria-hidden=\"true\">/</span><span aria-current=\"page\">Writing project</span></nav>",
    "snippet": "<nav class=\"nq-breadcrumb\" aria-label=\"Breadcrumb\">\n <a href=\"/\">Home</a><span aria-hidden=\"true\">/</span>\n <span aria-current=\"page\">Project</span>\n</nav>",
    "rule": "Use a labelled nav, links for ancestors and aria-current=page for the current location. Wrap rather than truncate essential context.",
    "props": [
      [
        "Direction",
        "RTL / LTR",
        "Use logical layout and language-appropriate text."
      ],
      [
        "States",
        "Default / Focus / Current / Compact",
        "Pinned visual specimens; live controls use native events."
      ]
    ],
    "states": [
      {
        "name": "Default",
        "html": "<nav class=\"nq-breadcrumb\" aria-label=\"Breadcrumb example\"><a href=\"#overview\">Nasaq</a> / <span aria-current=\"page\">Project</span></nav>"
      },
      {
        "name": "Focus",
        "html": "<a href=\"#overview\" class=\"state-focus\">Nasaq</a>"
      },
      {
        "name": "Current",
        "html": "<span aria-current=\"page\">Current project</span>"
      },
      {
        "name": "Compact",
        "html": "<nav class=\"nq-breadcrumb\" aria-label=\"Compact breadcrumb example\"><a href=\"#patterns\">Projects</a> / <span aria-current=\"page\">Writing</span></nav>"
      }
    ]
  }
};

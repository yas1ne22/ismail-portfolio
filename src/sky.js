import * as THREE from "three";

export function mountSky(host, windowElement) {
  const scene = new THREE.Scene(),
    camera = new THREE.PerspectiveCamera(70, 2 / 3, 0.1, 100);
  camera.position.z = 3;
  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: "low-power",
  });
  renderer.setSize(200, 300);
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setClearColor(0, 0);
  renderer.domElement.className = "sky-canvas";
  host.append(renderer.domElement);
  const loader = new THREE.TextureLoader(),
    cloud = loader.load("/assets/cloud.png");
  cloud.colorSpace = THREE.SRGBColorSpace;
  const layers = [
    [
      -1.5,
      -0.8,
      -16,
      0.04,
      0.35,
      10,
      1.5,
      0.4,
      0.4,
      0.4,
      1,
      4,
      "#c8d8e8",
      "#4a6a8a",
    ],
    [
      0.5,
      -0.8,
      -16,
      0.03,
      0.3,
      10,
      1.8,
      0.4,
      0.4,
      0.4,
      2,
      4,
      "#d0dce8",
      "#4a6a8a",
    ],
    [
      2.5,
      -0.8,
      -16,
      0.04,
      0.32,
      10,
      1.6,
      0.4,
      0.4,
      0.4,
      3,
      4,
      "#c8d8e8",
      "#4a6a8a",
    ],
    [
      -3,
      -0.85,
      -16,
      0.03,
      0.28,
      10,
      1.4,
      0.35,
      0.35,
      0.35,
      10,
      4,
      "#d0dce8",
      "#4a6a8a",
    ],
    [
      -1,
      -0.95,
      -9,
      0.08,
      0.55,
      14,
      2.2,
      0.7,
      0.7,
      0.7,
      4,
      4,
      "#f0f4f8",
      "#8aa0b8",
    ],
    [
      1,
      -0.9,
      -9,
      0.07,
      0.5,
      14,
      2,
      0.65,
      0.65,
      0.65,
      5,
      4,
      "#eef2f8",
      "#5a7898",
    ],
    [
      -3,
      -1,
      -9,
      0.09,
      0.48,
      12,
      1.8,
      0.6,
      0.6,
      0.6,
      6,
      4,
      "#f0f4f8",
      "#5a7898",
    ],
    [
      3,
      -0.62,
      -9,
      0.08,
      0.5,
      12,
      2,
      0.6,
      0.6,
      0.6,
      11,
      4,
      "#eef2f8",
      "#5a7898",
    ],
    [0, -1.3, -2.5, 0.48, 0.7, 18, 3, 1, 1, 1, 7, 5, "#fff", "#7a8fa8"],
    [
      -2,
      -1.4,
      -2.5,
      0.52,
      0.65,
      16,
      2.8,
      0.9,
      0.9,
      0.9,
      8,
      5,
      "#fffef8",
      "#7a8fa8",
    ],
    [2, -1.5, -2.5, 0.44, 0.6, 16, 2.5, 0.9, 0.9, 0.9, 9, 5, "#fff", "#7a8fa8"],
    [
      -4,
      -1.2,
      -2.5,
      0.5,
      0.62,
      16,
      2.6,
      0.85,
      0.85,
      0.85,
      12,
      5,
      "#fffef8",
      "#7a8fa8",
    ],
  ];
  const groups = [];
  for (const [
    x,
    y,
    z,
    speed,
    opacity,
    count,
    bx,
    by,
    bz,
    volume,
    seed,
    reset,
    color,
    shadow,
  ] of layers) {
    const group = new THREE.Group();
    group.position.set(x, y, z);
    scene.add(group);
    groups.push({ group, speed, reset });
    for (let layer = 0; layer < 2; layer++) {
      let randomSeed = seed + layer * 100;
      const random = () => {
        const v = Math.sin(randomSeed++) * 10000;
        return v - Math.floor(v);
      };
      const n = layer ? Math.floor(count * 0.7) : count;
      for (let i = 0; i < n; i++) {
        random();
        random();
        const px = (random() * 2 - 1) * bx,
          py = (random() * 2 - 1) * by * (layer ? 0.5 : 1),
          pz = (random() * 2 - 1) * bz;
        const length =
            1 -
            Math.max(Math.abs(px) / bx, Math.abs(py) / by, Math.abs(pz) / bz),
          size = Math.max(0.25, length) * volume * (layer ? 0.6 : 1) + 2;
        const material = new THREE.SpriteMaterial({
          map: cloud,
          color: layer ? shadow : color,
          opacity: opacity * (layer ? 0.7 : 1),
          depthWrite: false,
          rotation: (i * Math.PI) / n,
        });
        const sprite = new THREE.Sprite(material);
        sprite.position.set(px, py + (layer ? -by * 0.25 : by * 0.15), pz);
        sprite.scale.set(size, size, 1);
        group.add(sprite);
      }
    }
  }
  const cirrus = loader.load("/assets/CirrusCloud.png");
  cirrus.colorSpace = THREE.SRGBColorSpace;
  for (const [x, y, z, w, h, opacity] of [
    [0, 2, -24, 18, 1, 0.2],
    [-4, 2.1, -24, 18, 1, 0.6],
    [3, 1.5, -24, 18, 1, 0.2],
    [2, 1.3, -24, 18, 1, 0.4],
    [-5, 1.9, -24, 18, 1, 0.3],
    [-4, 1, -40, 40, 10, 1],
  ]) {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(w, h),
      new THREE.MeshBasicMaterial({
        map: cirrus,
        transparent: true,
        opacity,
        depthWrite: false,
      }),
    );
    mesh.position.set(x, y, z);
    scene.add(mesh);
  }
  const normals = loader.load("/assets/waternormals.jpg");
  normals.wrapS = normals.wrapT = THREE.RepeatWrapping;
  const waterMaterial = new THREE.ShaderMaterial({
    uniforms: { uTime: { value: 0 }, uNormalMap: { value: normals } },
    vertexShader:
      "varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}",
    fragmentShader: `uniform float uTime;uniform sampler2D uNormalMap;varying vec2 vUv;void main(){vec2 uv=vUv*120.;vec3 n1=texture2D(uNormalMap,uv*.8+vec2(uTime*.02,uTime*.01)).rgb*2.-1.;vec3 n2=texture2D(uNormalMap,uv*.5-vec2(uTime*.015,uTime*.008)).rgb*2.-1.;float waves=(n1.r+n2.r)*.5;vec3 color=mix(vec3(0.,.25,.60),vec3(.05,.40,.75),waves*.7);color=mix(color,vec3(.20,.60,.90),waves*waves*.3);color+=vec3(.8,.9,1.)*pow(abs(waves),8.)*.2;color=mix(color,vec3(.96,.98,1.),smoothstep(0.,.6,vUv.y)*.98);gl_FragColor=vec4(color,1.);}`,
  });
  const water = new THREE.Mesh(new THREE.PlaneGeometry(20, 20), waterMaterial);
  water.rotation.x = -Math.PI * 0.42;
  water.position.set(0, -1.9, 0.8);
  scene.add(water);
  let visible = true,
    last = performance.now(),
    time = 0;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
  }).observe(host);
  function render(now) {
    requestAnimationFrame(render);
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    if (
      !visible ||
      document.hidden ||
      windowElement.style.getPropertyValue("--shade") > 0.92 ||
      document.documentElement.classList.contains("is-covered")
    )
      return;
    if (!reduce.matches) {
      time += dt;
      for (const { group, speed, reset } of groups) {
        group.position.x -= dt * speed;
        if (group.position.x < -reset) group.position.x = reset;
      }
    }
    waterMaterial.uniforms.uTime.value = time;
    renderer.render(scene, camera);
  }
  requestAnimationFrame(render);
  host.classList.add("has-scene");
}

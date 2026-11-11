const tracks = [
  {title:'Velvet skies', artist:'Sonder Sessions · After Hours', duration:204, color:'#d3a8c5'},
  {title:'Golden hour', artist:'Sonder Sessions · Soft Focus', duration:187, color:'#d8b67b'},
  {title:'Blue in bloom', artist:'Sonder Sessions · Daydreams', duration:231, color:'#9cb8c5'},
];
const timestamp = seconds => `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;

export function mountUIWork(document) {
  const view = document.defaultView || globalThis;
  const reduced = view.matchMedia('(prefers-reduced-motion: reduce)');
  const player = document.querySelector('[data-sonder]');
  if (player) {
    let index = 0, position = 0, playing = false, timer = null, lastTick = 0;
    let visible = false;
    const saved = new Set();
    const play = player.querySelector('.sonder-play');
    const save = player.querySelector('.sonder-save');
    const progress = player.querySelector('.sonder-progress');
    const status = player.querySelector('[data-sonder-status]');
    const renderProgress = () => {
      progress.value = Math.floor(position);
      progress.setAttribute('aria-valuetext', `${timestamp(position)} of ${timestamp(tracks[index].duration)}`);
      player.querySelector('[data-track-time]').textContent = timestamp(position);
    };
    const stopTimer = () => { if (timer !== null) view.clearInterval(timer); timer = null; };
    const sync = () => {
      stopTimer();
      const active = playing && visible && !document.hidden;
      player.dataset.playing = String(active);
      if (active) {
        lastTick = Date.now();
        timer = view.setInterval(() => {
          const now = Date.now();
          position += (now - lastTick) / 1000;
          lastTick = now;
          if (position >= tracks[index].duration) { position = tracks[index].duration; setPlaying(false); status.textContent = 'Preview finished. Play again or try another track.'; }
          renderProgress();
        }, 250);
      }
    };
    const renderSaved = () => {
      const isSaved = saved.has(index);
      save.setAttribute('aria-pressed', String(isSaved));
      save.setAttribute('aria-label', `${isSaved ? 'Unsave' : 'Save'} ${tracks[index].title}`);
      save.textContent = isSaved ? '♥' : '♡';
    };
    function setPlaying(value) {
      playing = value;
      if (playing && position >= tracks[index].duration) position = 0;
      play.setAttribute('aria-pressed', String(playing));
      play.setAttribute('aria-label', playing ? 'Pause visual preview' : 'Play visual preview');
      play.firstElementChild.textContent = playing ? 'Ⅱ' : '▶';
      sync();
    }
    const changeTrack = direction => {
      index = (index + direction + tracks.length) % tracks.length;
      position = 0;
      const track = tracks[index];
      player.querySelector('[data-track-title]').textContent = track.title;
      player.querySelector('[data-track-artist]').textContent = track.artist;
      player.querySelector('[data-track-duration]').textContent = timestamp(track.duration);
      player.querySelector('.sonder-art').style.setProperty('--art-tone', track.color);
      const counter = player.querySelector('.sonder-track-count');
      counter.textContent = `0${index + 1} / 03`;
      counter.setAttribute('aria-label', `Track ${index + 1} of 3`);
      progress.max = track.duration;
      renderProgress(); renderSaved(); sync();
      const song = player.querySelector('.sonder-song');
      song.classList.remove('is-changing');
      void song.offsetWidth;
      song.classList.add('is-changing');
      status.textContent = `${track.title}. ${playing ? 'Visual preview playing.' : 'Ready to preview.'}`;
    };
    play.addEventListener('click', () => { setPlaying(!playing); status.textContent = playing ? 'Visual preview playing. No audio.' : 'Preview paused.'; });
    save.addEventListener('click', () => { saved.has(index) ? saved.delete(index) : saved.add(index); renderSaved(); status.textContent = `${tracks[index].title} ${saved.has(index) ? 'saved for this visit' : 'removed from saved tracks'}.`; });
    player.querySelector('[data-track-prev]').addEventListener('click', () => changeTrack(-1));
    player.querySelector('[data-track-next]').addEventListener('click', () => changeTrack(1));
    progress.addEventListener('input', () => { position = Number(progress.value); renderProgress(); });
    document.addEventListener('visibilitychange', sync);
    if (view.IntersectionObserver) {
      const observer = new view.IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }, {threshold:0.15});
      observer.observe(player);
    } else { visible = true; }
  }

  const kinetic = document.querySelector('[data-kinetic]');
  if (kinetic) {
    const shapes = [...kinetic.querySelectorAll('.kinetic-shape')];
    const buttons = [...kinetic.querySelectorAll('[data-arrangement]')];
    const duration = kinetic.querySelector('#kinetic-duration');
    const status = kinetic.querySelector('[data-kinetic-status]');
    let animations = [];
    const cancelAnimations = () => { animations.forEach(animation => animation.cancel()); animations = []; };
    const transforms = () => shapes.map(shape => view.getComputedStyle(shape).transform);
    const animateTo = starts => {
      if (reduced.matches) return;
      const ends = transforms();
      shapes.forEach((shape, i) => {
        if (!shape.animate) return;
        const animation = shape.animate([{transform:starts[i]}, {transform:ends[i]}], {
          duration:Number(duration.value), delay:i * 35, easing:'cubic-bezier(.22, 1.28, .36, 1)', fill:'backwards',
        });
        animations.push(animation);
      });
    };
    const showStatus = () => { status.textContent = `${kinetic.dataset.layout[0].toUpperCase() + kinetic.dataset.layout.slice(1)} / ${reduced.matches ? 'reduced motion' : 'spring easing'}`; };
    buttons.forEach(button => button.addEventListener('click', () => {
      const starts = transforms();
      cancelAnimations();
      kinetic.dataset.layout = button.dataset.arrangement;
      buttons.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
      animateTo(starts);
      showStatus();
    }));
    kinetic.querySelector('.kinetic-replay').addEventListener('click', () => {
      cancelAnimations();
      animateTo(shapes.map(() => 'translate(0px, 0px) rotate(-90deg) scale(.45)'));
      status.textContent = reduced.matches ? 'Arrangement shown / reduced motion' : `${kinetic.dataset.layout} / replaying`;
    });
    duration.addEventListener('input', () => { kinetic.querySelector('output').value = `${duration.value} ms`; });
    reduced.addEventListener('change', () => { cancelAnimations(); showStatus(); });
    showStatus();
  }
}

export function mountVanta(document) {
  const demo = document.querySelector('[data-vanta]');
  if (!demo) return;
  const screens = {
    transactions: demo.querySelector('.vanta-transactions'),
    balance: demo.querySelector('.vanta-balance'),
  };
  const buttons = [...document.querySelectorAll('[data-vanta-view]')];
  const show = name => {
    demo.dataset.screen = name;
    Object.entries(screens).forEach(([key, screen]) => { screen.hidden = key !== name; });
    buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.vantaView === name)));
  };
  buttons.forEach(button => button.addEventListener('click', () => show(button.dataset.vantaView)));
  show('transactions');
}

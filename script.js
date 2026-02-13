document.addEventListener('DOMContentLoaded', function(){
  const elements = document.querySelectorAll('div>div>div');

  function runAnimation() {
    elements.forEach(function(element, id){
        element.style.position = 'relative';
        element.style.top = '-200px';
        element.style.opacity = '0';
        element.style.transition = 'all 1s ease';
        
        const wait = Math.floor((Math.random()*3000)+1);
        setTimeout(function(){
            element.style.top = '0px';
            element.style.opacity = '1';
        }, wait);
    });
  }

  runAnimation();

  setInterval(runAnimation, 5000);

  // --- Music controls ---
  const audio = document.getElementById('bg-music');
  const toggle = document.getElementById('music-toggle');
  const fileInput = document.getElementById('music-file');
  const volume = document.getElementById('music-volume');

  function updateToggle(paused){
    if(!toggle) return;
    toggle.textContent = paused ? 'Play Music' : 'Pause Music';
    toggle.setAttribute('aria-pressed', (!paused).toString());
  }

  // Try to autoplay; if blocked, resume on first user interaction (no visible button)
  if(audio){
    audio.autoplay = true;
    const p = audio.play && audio.play();
    if(p && p.then){
      p.catch(function(){
        function resume(){
          audio.play && audio.play().catch(function(){});
          window.removeEventListener('click', resume);
          window.removeEventListener('keydown', resume);
        }
        window.addEventListener('click', resume, {once:true});
        window.addEventListener('keydown', resume, {once:true});
      });
    }
  }

  // set initial volume
  if(audio && volume){
    audio.volume = parseFloat(volume.value);
    volume.addEventListener('input', function(){
      audio.volume = parseFloat(this.value);
    });
  }

  if(toggle && audio){
    toggle.addEventListener('click', function(){
      if(audio.paused){
        const p = audio.play();
        if(p && p.then) p.catch(()=>{});
      } else {
        audio.pause();
      }
      updateToggle(audio.paused);
    });

    // update label when playback state changes
    audio.addEventListener('play', function(){ updateToggle(false); });
    audio.addEventListener('pause', function(){ updateToggle(true); });
  }

  // allow user to pick a local file
  if(fileInput && audio){
    fileInput.addEventListener('change', function(e){
      const f = this.files && this.files[0];
      if(!f) return;
      const url = URL.createObjectURL(f);
      audio.src = url;
      audio.play().catch(()=>{});
      updateToggle(false);
    });
  }
});

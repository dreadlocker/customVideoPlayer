window.onload = function () {
  //#region Get elements
  const infoImg = document.getElementById("infoImg");
  const player = document.getElementById("player");
  const video = document.getElementById("viewer");
  const progress = document.getElementById("progress");
  const progressBar = document.getElementById("progress_filled");
  const toggle = document.getElementById("toggle");
  const volumeSlider = document.getElementById("volumeSlider");
  const videoSpeedSlider = document.getElementById("videoSpeedSlider");
  const skipForward = document.getElementById("skipForward");
  const skipBackward = document.getElementById("skipBackward");
  const fullScreen = document.getElementById("fullScreen");
  //#endregion

  //#region Build functions
  // for Mobile devices
  (function isMobile() {
    if (navigator.userAgent.indexOf("Mobile") > -1) {
      infoImg.style.display = "none";
      player.style.paddingTop = "0.5em";
    } else {
      // keyboard event listeners
      window.addEventListener("keyup", e => {
        if (e.keyCode === 70) return enterFullScreen();
        if (e.keyCode === 27) return exitFullscreen();
        if (e.keyCode === 39) return skipForward.click();
        if (e.keyCode === 37) return skipBackward.click();
        if (e.keyCode === 32) togglePlay();
        if (e.keyCode === 40)
          return (volumeSlider.value = parseFloat(volumeSlider.value) - 0.1);
        if (e.keyCode === 38)
          return (volumeSlider.value = parseFloat(volumeSlider.value) + 0.1);
      });
    }
  })();

  // for PC only
  function alertMsg(e) {
    e.stopPropagation();

    alert(
      `Keyboard shortcuts:
      Space - Play/pause video
      Right arrow - go forward
      Left arrow - go backward
      Arrow up - increase volume
      Arrow down - decrease volume
      F - enable fullscreen
      Escape - disable fullscreen`
    );
  }

  // Play/pause the video
  function togglePlay(e) {
    // if you execute the function using keyboard shortcut, e === undefined 
    // stopPropagation if 'e' isn't undefined
    if (e) e.stopPropagation();


    if (video.paused) {
      video.play();
      toggle.innerHTML = "&#9208;";
      return;
    }

    video.pause();
    toggle.innerHTML = "&#9658;";
  }

  // skip Forward or Backward
  const skipForwardBackward = e => {
    e.stopPropagation();
    video.currentTime += parseInt(e.target.value);
  };

  // change video volume or speed rate && next element text
  function handleRangeUpdate(e) {
    if (this.id === "volumeSlider") {
      this.nextElementSibling.innerHTML = this.value * 100 + "%";
      video.volume = this.value;
    }
    if (this.id === "videoSpeedSlider") {
      this.nextElementSibling.innerHTML = "x" + this.value;
      video.playbackRate = this.value;
    }
  }

  // move progress bar depending on the video time elapsed
  function handleProgress() {
    const percent = (video.currentTime / video.duration) * 100;
    progressBar.style.width = percent + "%";
  }

  // click or drag the mouse to go to a different time of the video
  function scrub(e) {
    e.stopPropagation();

    video.currentTime = (e.offsetX / progress.offsetWidth) * video.duration;
    // e.offsetX - width of the event in px
    // progress.offsetWidth - width of the DOM element in px
  }

  function enterFullScreen(e) {
    // if you execute the function using keyboard shortcut, e === undefined 
    // stopPropagation if 'e' isn't undefined
    if (e) e.stopPropagation();

    if (video.requestFullscreen) {
      video.requestFullscreen();
    } else if (video.mozRequestFullScreen) {
      video.mozRequestFullScreen();
    } else if (video.webkitRequestFullscreen) {
      video.webkitRequestFullscreen();
    } else if (video.msRequestFullscreen) {
      video.msRequestFullscreen();
    }
  }

  function exitFullscreen() {
    if (video.exitFullscreen) {
      Document.exittFullscreen();
    } else if (video.mozExitFullScreen) {
      Document.mozExitFullScreen();
    } else if (Document.webkitExitFullscreen) {
      Document.webkitExitFullscreen();
    } else if (video.msExitFullscreen) {
      Document.msExitFullscreen();
    }
  }
  //#endregion

  //#region Hook up event listeners
  video.addEventListener("click", togglePlay);
  toggle.addEventListener("click", togglePlay);
  skipForward.addEventListener("click", skipForwardBackward);
  skipBackward.addEventListener("click", skipForwardBackward);
  volumeSlider.addEventListener("change", handleRangeUpdate);
  videoSpeedSlider.addEventListener("change", handleRangeUpdate);
  video.addEventListener("timeupdate", handleProgress);
  infoImg.addEventListener("click", alertMsg);
  fullScreen.addEventListener("click", enterFullScreen);
  progress.addEventListener("click", scrub);

  // #region change video time on mouse click + drag
  let mousedown = false;
  progress.addEventListener("mousedown", () => (mousedown = true));
  progress.addEventListener("mouseup", () => (mousedown = false));
  progress.addEventListener("mousemove", e => mousedown && scrub(e));
  //#endregion
  //#endregion
};
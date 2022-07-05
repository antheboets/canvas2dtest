window.addEventListener("load",()=>{
    console.log("dom loaded")

    const setCanvasToScreen = (cnvs) =>{
        //console.log(window.innerHeight,window.innerWidth)
        cnvs.height = window.innerHeight
        cnvs.width = window.innerWidth
    }

    
    const canvas = document.getElementById("canvas")
   
    setCanvasToScreen(canvas)
    window.addEventListener('resize',()=>{setCanvasToScreen(canvas)})

    const ctx = canvas.getContext("2d")
    let videoContainer
    
    
    //https://riptutorial.com/html5-canvas/example/14974/basic-loading-and-playing-a-video-on-the-canvas-
    //https://developer.chrome.com/blog/autoplay/
    let video = document.createElement("video"); // create a video element
    
    video.src = "./1651756907919.webm"; 
    // the video will now begin to load.
    // As some additional info is needed we will place the video in a
    // containing object for convenience
    video.muted = true;
    video.autoPlay = true; // ensure that the video does not auto play
    video.loop = true; // set the video to loop.
   
    videoContainer = {  // we will add properties as needed
        video : video,
        ready : false,   
    };
    
    video.oncanplay = readyToPlayVideo; // set the event to the play function that 
                                  // can be found below

    function readyToPlayVideo(event){ // this is a referance to the video
        // the video may not match the canvas size so find a scale to fit
        videoContainer.scale = Math.min(
                             canvas.width / this.videoWidth, 
                             canvas.height / this.videoHeight); 
        videoContainer.ready = true;
        videoContainer.video.play();
        // the video can be played so hand it off to the display function
        requestAnimationFrame(updateCanvas);
        
    }


    function updateCanvas(){
        ctx.clearRect(0,0,canvas.width,canvas.height); // Though not always needed 
                                                         // you may get bad pixels from 
                                                         // previous videos so clear to be
                                                         // safe
        // only draw if loaded and ready
        if(videoContainer !== undefined && videoContainer.ready){ 
            // find the top left of the video on the canvas
            var scale = videoContainer.scale;
            var vidH = videoContainer.video.videoHeight;
            var vidW = videoContainer.video.videoWidth;
            var top = canvas.height / 2 - (vidH /2 ) * scale;
            var left = canvas.width / 2 - (vidW /2 ) * scale;
            // now just draw the video the correct size
            ctx.drawImage(videoContainer.video, left, top, vidW * scale, vidH * scale);
            if(videoContainer.video.paused){ // if not playing show the paused screen 
                drawPayIcon();
            }
        }
        // all done for display 
        // request the next frame in 1/60th of a second
        requestAnimationFrame(updateCanvas);
    }
    function drawPayIcon(){
        ctx.fillStyle = "black";  // darken display
        ctx.globalAlpha = 0.5;
        ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle = "#DDD"; // colour of play icon
        ctx.globalAlpha = 0.75; // partly transparent
        ctx.beginPath(); // create the path for the icon
        var size = (canvas.height / 2) * 0.5;  // the size of the icon
        ctx.moveTo(canvas.width/2 + size/2, canvas.height / 2); // start at the pointy end
        ctx.lineTo(canvas.width/2 - size/2, canvas.height / 2 + size);
        ctx.lineTo(canvas.width/2 - size/2, canvas.height / 2 - size);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1; // restore alpha
   }  
   function playPauseClick(){
    if(videoContainer !== undefined && videoContainer.ready){
         if(videoContainer.video.paused){                                 
               videoContainer.video.play();
         }else{
               videoContainer.video.pause();
         }
    }
}
// register the event
canvas.addEventListener("click",playPauseClick);

})
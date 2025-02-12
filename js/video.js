document.addEventListener("DOMContentLoaded", function() {
    const sceneContainer = document.querySelector("#scene-containervideo");
    
    // Apply green background to the container
    sceneContainer.style.backgroundColor = "#37d813";
    sceneContainer.style.padding = "20px";
    sceneContainer.style.display = "flex";
    sceneContainer.style.flexDirection = "column";
    sceneContainer.style.justifyContent = "center";
    sceneContainer.style.alignItems = "center";
    sceneContainer.style.height = "100vh";
    sceneContainer.style.position = "relative"; // Allows absolute positioning inside

    // Create video element
    const video = document.createElement("video");
    video.id = "demo-video";
    video.src = "images/NVGAMEDEMO.mp4"; // Ensure the correct path
    video.autoplay = true;
    video.muted = true;
    video.loop = true;
    video.controls = true; // Add default controls
    video.style.width = "80%";
    video.style.height = "auto";
    video.style.display = "block";
    video.style.margin = "0 auto"; // Centers the video horizontally
    
    // Create control buttons
    const controlsContainer = document.createElement("div");
    controlsContainer.style.marginTop = "10px";
    
    const buttonStyle = {
        fontFamily: "a4speed, sans-serif",
        backgroundColor: "#FF1493", // Hot pink color
        color: "white",
        padding: "10px 20px",
        fontSize: "20px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        margin: "5px"
    };

    const playButton = document.createElement("button");
    playButton.innerText = "Play";
    Object.assign(playButton.style, buttonStyle);
    playButton.onclick = function() {
        video.play();
    };

    const pauseButton = document.createElement("button");
    pauseButton.innerText = "Pause";
    Object.assign(pauseButton.style, buttonStyle);
    pauseButton.onclick = function() {
        video.pause();
    };

    controlsContainer.appendChild(playButton);
    controlsContainer.appendChild(pauseButton);
    
    // Create BACK link
    const backLink = document.createElement("a");
    backLink.innerText = "BACK";
    backLink.href = "index.html";
    backLink.style.position = "absolute";
    backLink.style.bottom = "20px";
    backLink.style.left = "20px";
    backLink.style.fontFamily = "a4speed, sans-serif";
    backLink.style.fontSize = "24px";
    backLink.style.color = "white";
    backLink.style.backgroundColor = "#FF1493";
    backLink.style.padding = "10px 15px";
    backLink.style.borderRadius = "5px";
    backLink.style.textDecoration = "none";
    backLink.style.cursor = "pointer";

    // Append elements to container
    sceneContainer.appendChild(video);
    sceneContainer.appendChild(controlsContainer);
    sceneContainer.appendChild(backLink);
});

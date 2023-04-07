toggleDevTools = function () {
    let devTools = document.querySelectorAll(".devTool");
    devTools.forEach((devTool) => {
        devTool.classList.toggle("devHide");
    })
};

toggleDevMode = function() {
    let devMode = localStorage.getItem("devMode");
    if (devMode === "true"){
        localStorage.setItem("devMode", "false");
    }else{
        localStorage.setItem("devMode", "true");
    }
}

getDevMode = function() {
    return localStorage.getItem("devMode");
}
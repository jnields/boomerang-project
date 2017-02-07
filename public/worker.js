global.onmessage = function(e) {
    const file = e.data;
    const reader = new FileReader();
    reader.onload = function(loaded) {
        global.postmessage(loaded.target.result);
    };
    reader.readAsDataURL(file);
};

$(document).ready(function() {
    let image = $('#image')
    let previous = 1

    image.hover(function() {
        image.attr('src', '../assets/rogue' + (previous == 1 ? 2 : 1) + '.jpg')
        previous = previous == 1 ? 2 : 1
    })
});
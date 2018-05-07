$(document).ready(function() {
    $('#change_button').click(function() {
        let student1 = $('#s1')
        let student2 = $('#s2')
        let temp = student1.text()

        student1.text(student2.text())
        student2.text(temp)
    });
});
$(function() {
    console.log( "ready!" );

    $(".diff-wrapper").prettyTextDiff({
        originalContent: $('#original').val(),
        changedContent: $('#changed').val(),
        diffContainer: ".diff1"
    });

    // Run diff on textarea change
    $(".diff-textarea").on('change keyup', function() {
        $(".diff-wrapper").prettyTextDiff({
            originalContent: $('#original').val(),
            changedContent: $('#changed').val(),
            diffContainer: ".diff1"
        });

    });

    loadFile();
});

function loadFile() {
    // var client = new XMLHttpRequest();
    // client.open('GET', 'foo.txt');
    // client.onreadystatechange = function() {
    //   alert(client.responseText);
    // }
    // client.send();

    var xhr = new XMLHttpRequest();
    xhr.open("GET","foo.txt");
    xhr.onload=function(){
        console.log(xhr.responseText);
    }
    xhr.send();
};

$('select').on('change', function() {
    alert( this.value );
    
    var x = $(this).parent().find('textarea').val();
    alert(x);
});
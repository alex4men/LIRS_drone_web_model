export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function format(aInt){return(('00'+aInt).substring((''+aInt).length));}

export function getFormatTimeFromSecond(sec){
    var hh = Math.floor(sec / 3600);
    var mm = Math.floor(sec / 60) % 60;
    var ss = Math.floor(sec) % 60;

    return format(hh)+':'+format(mm)+':'+format(ss);
}
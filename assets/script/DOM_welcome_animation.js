var welcome = 'elcome, look for a hotel';
setTimeout(function() {
  for (var i = 0; i < welcome.length; i++) {
    (function(index) {
      setTimeout(function() {
        $('.welcome-animation').append(welcome[index]);
      }, 100 * index);
    })(i);
  }
}, 100);
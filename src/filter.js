import Vue from 'vue'

Vue.filter('month', function (val, showYear = true) {
  val = String(val)

  const regx = /\w+\s(\w+)\s\d+\s(\d+)./;
  if (!showYear) {
    return regx.exec(val)[1];
  } else {
    return regx.exec(val)[1] + ' ' + regx.exec(val)[2];
  }

})


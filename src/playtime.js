(function(scope) {
  scope.playtime = function(diagram, config) {
    config = config || {};
    config.element = config.element || 'body';
    config.timeline = config.timeline || 'body';

    var playdiv = d3.select(config.element);

    var timelinediv = d3.select(config.timeline),
      radios = timelinediv.selectAll('form .year input'),
      len = radios[0].length,
      current = len - 1,
      actions = [],
      playInterval;

    // create an array of objects in order to be able to simulate click on buttons when animating
    // this is enormously ugly code, bleah!
    radios.each(function(d, i) {
      actions[i] = {
        'button': this,
        'action': d3.select(this).on('click'),
        'd': d,
        'i': i
      };
    });

    function getCurrentSelected() {
      var index;
      timelinediv.selectAll('form .year input').each(function(d, i) {
        var that = d3.select(this);
        if (that.property('checked') === true) {
          console.log('found it: ' + i);
          index = +i;
        }
      });
      return index;
    }

    var play = playdiv.select('.fa-play');
    play.on('click', function() {
      // change look
      play.style('opacity', 0.4);
      stop.style('opacity', 1.0);
      current = getCurrentSelected();
      // TODO: we should disable mouse click while playing...

      // iterate thru all radio buttons and simulate a click event
      playInterval = setInterval(function() {
        current = (current + 1) % len;
        actions[current].action.apply(actions[current].button, [actions[current].d, actions[current].i]);
        // TODO: revive tooltip? How?!!!
      }, 1500); // 1.5 seconds
    });

    var stop = playdiv.select('.fa-stop')
        .style('opacity', 0.4);
    stop.on('click', function() {
      stop.style('opacity', 0.4);
      play.style('opacity', 1.0);
      clearInterval(playInterval);
    });
  };
})(window.Globalmigration || (window.Globalmigration = {}));

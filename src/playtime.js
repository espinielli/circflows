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

    var svg = playdiv.append("svg")
      .attr("width", "70")
      .attr("height", "30");

    // Play button
    var play = svg.append("g")
      .attr("transform", "translate(0,0)");

    // Stop button
    var stop = svg.append("g")
      .attr("transform", "translate(40,0)");


    // Play button details
    play.append("rect")
      .attr("width", 30)
      .attr("height", 30)
      .style("fill-opacity", 0.0);

    play.append("path")
      .attr("d", "M5 0 L5 30 L30 15 Z")
      .style("fill", "black");

    play.append("title")
      .text("Play");

    play.on('click', function() {
      // change look
      play.style('fill-opacity', 0.4);
      stop.style('fill-opacity', 1.0);
      current = getCurrentSelected();
      // TODO: we should disable mouse click while playing...

      // iterate thru all radio buttons and simulate a click event
      playInterval = setInterval(function() {
        current = (current + 1) % len;
        actions[current].action.apply(actions[current].button, [actions[current].d, actions[current].i]);
        // TODO: revive tooltip? How?!!!
      }, 1500); // 1.5 seconds
    });




    // Stop button details
    stop.append("rect")
      .attr("width", 30)
      .attr("height", 30)
      .style("fill-opacity", 0.0);

    stop.append("path")
      .attr("d", "M2 2 L2 28 L28 28 L28 2 Z")
      .style("fill", "black");
    stop.style('fill-opacity', 0.4);

    stop.append("title")
      .text("Stop");

    stop.on('click', function() {
      stop.style('fill-opacity', 0.4);
      play.style('fill-opacity', 1.0);
      clearInterval(playInterval);
    });


    // var play = playdiv.select('.fa-play');
    // play.on('click', function() {
    //   // change look
    //   play.style('opacity', 0.4);
    //   stop.style('opacity', 1.0);
    //   current = getCurrentSelected();
    //   // TODO: we should disable mouse click while playing...

    //   // iterate thru all radio buttons and simulate a click event
    //   playInterval = setInterval(function() {
    //     current = (current + 1) % len;
    //     actions[current].action.apply(actions[current].button, [actions[current].d, actions[current].i]);
    //     // TODO: revive tooltip? How?!!!
    //   }, 1500); // 1.5 seconds
    // });

    // var stop = playdiv.select('.fa-stop')
    //     .style('opacity', 0.4);
    // stop.on('click', function() {
    //   stop.style('opacity', 0.4);
    //   play.style('opacity', 1.0);
    //   clearInterval(playInterval);
    // });
  };
})(window.Globalmigration || (window.Globalmigration = {}));

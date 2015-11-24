(function() {

  // we have JS
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');

  var peekNavigation = {

    init: function() {
      // Hide the peek navigation
      document.body.classList.add('peek--hide');
      // nudge up otherwise can't scroll down first
      window.scrollTo(0, 1); 
      
      // cache vars
      this.peekHeight = document.querySelector('.nav__peek').scrollHeight - 16;

      this.bindEvents();
    },

    bindEvents: function() {
      window.addEventListener('scroll', this.togglePeekClass.bind(this), false);
      document.querySelector('.nav__clip').addEventListener('click', this.togglePeekClass, false);
    },

    togglePeekClass: function() {
      if (event.type === 'click') {
        document.body.classList.toggle('peek--hide');
      } else {
        var scrollY = document.body.scrollTop || document.documentElement.scrollTop;
        if (scrollY === 0) {
          document.body.classList.remove('peek--hide');
        } else if (scrollY < this.peekHeight && document.body.classList.contains('peek--hide') === false) {
          document.body.classList.add('peek--hide');
        }
      }
    }
  };

  peekNavigation.init();




  formHandling: {
    /* FORM IS HIDDEN UNTIL REVEALED */
    var formLinks = document.querySelectorAll("a[href='#contact']");
    for (var i = 0; i < formLinks.length; ++i) {
      var formLink = formLinks[i];
      formLink.addEventListener('click', function(event){
        event.preventDefault();
        revealForm();
      });
    }
    // only have to hover over .js-form to reveal
    document.querySelector('.js-form').addEventListener('mouseover', function(event){
      revealForm();
    });


    // TODO REMOVE EVENT LISTENERS ONCE REVEALED

    function revealForm() {
      var theForm = document.getElementById('contact');
      theForm.style.maxHeight = "500px";
    }

    /* TEXTAREA AUTOEXPAND */
    var targetArea = document.getElementsByClassName('autoexpand')[0],
        lineHeightPx = getComputedStyle(targetArea).getPropertyValue("line-height"),
        lineHeight = parseInt(lineHeightPx, 10),
        oneTime = function() {
          var savedValue = this.value;
          this.baseScrollHeight = this.scrollHeight;
          this.value = savedValue;
          targetArea.removeEventListener('focus', oneTime);
        },
        adjustHeight = function() {
          var minRows = +this.getAttribute('data-min-rows') || 1,
              rows;
          this.rows = minRows;
          rows = Math.round( (this.scrollHeight - this.baseScrollHeight) / lineHeight );

          this.rows = minRows + rows;
        };
    targetArea.addEventListener('focus', oneTime);
    targetArea.addEventListener('input', adjustHeight);
    // if we have JavaScript...
    // then reset rows = data-min-rows
    var setRows = +targetArea.getAttribute('data-min-rows') || 1;
    targetArea.rows = setRows;

    /* FORM VALIDATION */
    // set email type to email (only if we have JS)
    var inputEmail = document.getElementsByClassName('input__field--email')[0];
    inputEmail.setAttribute('type','email');
    // special treatment for email field, maintain focus if not valid
    inputEmail.addEventListener('blur', function(){
      if ( !this.checkValidity() ) {
        this.focus();
      }
    });
    // test validity of whole form to style submit button
    var theForm = document.forms[0];
    theForm.addEventListener('input', function() {
      if ( this.checkValidity() ) {
        document.querySelector('input[type="submit"]').classList.add('valid');
      } else {
        document.querySelector('input[type="submit"]').classList.remove('valid');
      }      
    });
    theForm.addEventListener('submit', function(event) {
      if ( !this.checkValidity() ) {

        console.log("invalid!");

        event.preventDefault();
      }
    })
  }


  smoothScrolling: {
    // is new native support available?
    var isSmoothScrollSupported = 'scrollBehavior' in document.documentElement.style;
    if ( isSmoothScrollSupported ) {
      return;
    }
    // gather internal anchor links
    var targetLinks = document.querySelectorAll("a[href^='#']:not([href='#'])");
    // attach event handlers
    for (var i = 0; i < targetLinks.length; ++i) {
      var targetLink = targetLinks[i];
      targetLink.addEventListener('click', function(e){
        e.preventDefault();
        var target = this.hash, // e.g. #contact
            targetY = getElementY( document.getElementById(target.slice(1)) );
        if (target.length) {
          smoothScroll( targetY );
        }
      });
    }

    function getElementY(element) {
      var y = element.offsetTop,
          node = element;
      while (node.offsetParent && node.offsetParent !== document.body) {
          node = node.offsetParent;
          y += node.offsetTop;
      } 
      return y;
    }

    function getCurrentY() {
      // Firefox, Chrome, Opera, Safari
      if (self.pageYOffset) {return self.pageYOffset;}
      // Internet Explorer 6 - standards mode
      if (document.documentElement && document.documentElement.scrollTop)
          {return document.documentElement.scrollTop;}
      // Internet Explorer 6, 7 and 8
      if (document.body.scrollTop) {return document.body.scrollTop;}
      return 0;
    }

    function smoothScroll(targetY) {
      var startY = getCurrentY(),
          scrollBy = targetY - startY,
          speed = Math.abs(scrollBy / 100),
          increment = scrollBy / 25;

      // if close just jump
      if ( Math.abs(scrollBy) < 100 ) {
        scrollTo(0, targetY);
        return;
      }
      // otherwise animate the scroll
      var intermediateY;
      for ( var i=0; i<=25; i++) {
        intermediateY = Math.round(startY + i * increment);
        setTimeout("window.scrollTo(0, " + intermediateY + ")", Math.round(i*speed) );
      }
    }
  }




  /* TODO: tidy up event listeners to remove when not required */
  // add polyfill for form validity? https://github.com/ryanseddon/H5F
}());

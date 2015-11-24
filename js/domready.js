(function() {

  // we have JS
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');


  var peekNavigation = {

    init: function() {
      // Hide the peek navigation
      document.body.classList.add('peek-nav--hide');
      // nudge up otherwise can't scroll down first
      window.scrollTo(0, 1); 
      
      // cache vars
      this.peekHeight = document.querySelector('.nav-head').scrollHeight - 16;

      this.bindEvents();
    },

    bindEvents: function() {
      window.addEventListener('scroll', this.togglePeekClass.bind(this), false);
      document.querySelector('.paper-clip').addEventListener('click', this.togglePeekClass, false);
    },

    togglePeekClass: function(event) {
      if (event.type === 'click') {
        document.body.classList.toggle('peek-nav--hide');
      } else {
        var scrollY = document.body.scrollTop || document.documentElement.scrollTop;
        if (scrollY === 0) {
          document.body.classList.remove('peek-nav--hide');
        } else if (scrollY < this.peekHeight && document.body.classList.contains('peek-nav--hide') === false) {
          document.body.classList.add('peek-nav--hide');
        }
      }
    }
  };
  peekNavigation.init();



  var formHandling = {

    init: function() {
      // cache DOM queries
      this.contactForm = document.forms[0]; // the form
      this.autoexpandTarget = document.querySelector('.autoexpand'); // the form textarea
      this.jsForm = document.querySelector('.js-form'); // a particular link to the form
      this.inputEmail = document.querySelector('.input__field--email'); // the form email field


      // we know we have JS so...
      // - reset textarea rows
      this.minRows = +this.autoexpandTarget.getAttribute('data-min-rows') || 1;
      this.autoexpandTarget.rows = this.minRows;
      // - set type of email field to 'email' not text
      this.inputEmail.setAttribute('type','email');

      this.bindEvents();
    },

    bindEvents: function() {
      //reveal the hidden form
      this.thisShouldRevealForm = this.shouldRevealForm.bind(this); // to be able to remove event listener with 'this' binding
      window.addEventListener('click', this.thisShouldRevealForm, false);
      this.jsForm.addEventListener('mouseover', this.doRevealForm, false);

      // continuously adjust textarea height on input
      this.autoexpandTarget.addEventListener('input', this.adjustHeight.bind(this), false);

      // continuously monitor form validity to style submit button
      this.contactForm.addEventListener('input', this.buttonValidity, false);

      // special treatment for email field, maintain focus if not valid
      this.inputEmail.addEventListener('blur', function(){
        if ( !this.checkValidity() ) { this.focus(); }
      });

      // prevent form submission if not valid
      this.contactForm.addEventListener('submit', function(event) {
        if ( !this.checkValidity() ) { event.preventDefault(); }

        // TESTING
        console.log("form...", this);

      });
    },

    shouldRevealForm: function(event) {
      if (event.target.hash === "#contact") {
        this.doRevealForm();
      }
    },

    doRevealForm: function() {
      // height is auto, need to animate max-height for transition to work
      this.contactForm.style.maxHeight = "500px";
      // trigger steps when transition complete and form becomes 'active'
      setTimeout( this.onRevealForm.bind(this), 350 );
      // stop listening
      window.removeEventListener('click', this.thisShouldRevealForm);
      this.jsForm.removeEventListener('mouseover', this.doRevealForm);
    },

    onRevealForm: function() {
      // now form is active gather some metrics
      var lineHeightPx = getComputedStyle(this.autoexpandTarget).getPropertyValue("line-height");
      this.lineHeight = parseInt(lineHeightPx, 10);
      this.autoexpandTarget.baseScrollHeight = this.autoexpandTarget.scrollHeight;

      // reset max-height restriction to make space for non-empty message
     this.contactForm.style.maxHeight = 'none';
    },

    adjustHeight: function(event) {
      event.target.rows = this.minRows;
      var rows = Math.round( (event.target.scrollHeight - event.target.baseScrollHeight) / this.lineHeight );
      event.target.rows = this.minRows + rows;
    },

    buttonValidity: function() {
      var submitButton = document.querySelector('input[type="submit"]');
      if ( this.checkValidity() ) {
        submitButton.classList.add('valid');
      } else {
        submitButton.classList.remove('valid');
      }
    }
  };
  formHandling.init();



  var smoothScrolling = {
    // add smooth vertical scrolling to internal anchors
    init: function() {
      // if new native support available we don't need any of this
      var isSmoothScrollSupported = 'scrollBehavior' in document.documentElement.style;
      if ( isSmoothScrollSupported ) {
        return;
      }

      this.bindEvents();
    },

    bindEvents: function() {
      window.addEventListener('click', this.triggerScroll.bind(this), false);
    },

    triggerScroll: function(event) {
      // is this an internal anchor?
      if ( event.target.hash && event.target.pathname.replace(/^\//,'') === location.pathname.replace(/^\//,'') ) {
        var target = document.getElementById( event.target.hash.slice(1) ),
            targetY = this.getElementY( target );
        this.smoothScroll( targetY );
        event.preventDefault();
      }
    },

    getElementY: function(element) {
      var y = element.offsetTop,
          node = element;
      while (node.offsetParent && node.offsetParent !== document.body) {
          node = node.offsetParent;
          y += node.offsetTop;
      } 
      return y;
    },

    getCurrentY: function() {
      // Firefox, Chrome, Opera, Safari
      if (window.self.pageYOffset) {return window.self.pageYOffset;}
      // Internet Explorer 6 - standards mode
      if (document.documentElement && document.documentElement.scrollTop)
          {return document.documentElement.scrollTop;}
      // Internet Explorer 6, 7 and 8
      if (document.body.scrollTop) {return document.body.scrollTop;}
      return 0;
    },

    smoothScroll: function(targetY) {
      var startY = this.getCurrentY(),
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
  };
  smoothScrolling.init();



  var animateDonut = {
    init: function() {

      this.bindEvents();
    },
    bindEvents: function() {
      this.thisTriggerAnimation = this.triggerAnimation.bind(this);
      setTimeout( function(){
        window.addEventListener('scroll', animateDonut.thisTriggerAnimation, false);
      }, 400 );
    },
    triggerAnimation: function() {
      document.querySelector('.donut').classList.add('animate');
      window.removeEventListener('scroll', this.thisTriggerAnimation );
    }
  };
  if ( document.querySelector('.donut') ) {
    animateDonut.init();
  }

/*
  var copyPaste = function() {
    if ( Clipboard ) {
      console.log("have clipboard");
      var linkSite = new Clipboard('.link-site', {
        text: function(trigger) {
          return "http://sidebarnone.com/";
        }
      });
      linkSite.on('success', function(e) {
        console.info('Text:', e.text);
        e.clearSelection();
      });
      linkSite.on('error', function(e) {
          console.error('error', e);
      });

      new Clipboard('.link-page', {
        text: function(trigger) {
          return "http://sidebarnone.com/making-a-website.html";
        }
      });
    }
  };
  window.onload = copyPaste;
*/

  // add polyfill for form validity? https://github.com/ryanseddon/H5F
}());

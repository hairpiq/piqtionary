module.exports = function(markup) {
	var html = [
	    '<!DOCTYPE html>',
	    '<html class="no-js" lang="">',
	      '<head>',
	        '<meta charset="utf-8"/>',
	        '<meta http-equiv="X-UA-Compatible" content="IE=edge">',
    		'<title>Hairpiq</title>',
	        '<meta name="description" content="intelligent hair services">',
	        // <!-- Use minimum-scale=1 to enable GPU rasterization -->
	        '<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0, maximum-scale=1, minimum-scale=1">',
	        // <!-- Google Site Verification -->
	        '<meta name="google-site-verification" content="nhsuVYUKQtmHlNyJWNzD2JLLnIKfyoQwnWRHjbUjQgg" />',
	        '<link href="/assets/images/favicon.ico" rel="shortcut icon">',
	        '<link rel="stylesheet" href="/css/styles.css"></link>',
	        '<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">',
	      '</head>',
	      '<body>',
	        '<div id="app" class="loading">' + markup + '</div>',
	        '<script>',
				'var WebFontConfig = {',
					'google: { families: [ "Roboto:400,300,500:latin", "Montserrat:400,700" ] }',
				'};',
				'(function() {',
					'var wf = document.createElement("script");',
					'wf.src = "https://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js";',
					'wf.type = "text/javascript";',
					'wf.async = "true";',
					'var s = document.getElementsByTagName("script")[0];',
					's.parentNode.insertBefore(wf, s);',
				'})();',
		    '</script>',
	        '<script type="text/javascript" src="https://code.jquery.com/jquery-2.1.1.min.js"></script>',
		    //<!-- Drip -->
			'<script type="text/javascript">',
			  'var _dcq = _dcq || [];',
			  'var _dcs = _dcs || {};',
			  '_dcs.account = "8434294";',
			  '(function() {',
			    'var dc = document.createElement("script");',
			    'dc.type = "text/javascript"; dc.async = true;',
			    'dc.src = "//tag.getdrip.com/8434294.js";',
			    'var s = document.getElementsByTagName("script")[0];',
			    's.parentNode.insertBefore(dc, s);',
			  '})();',
			'</script>',
	      	'<script type="text/javascript" src="/app.js"></script>',
	      '</body>',
	    '</html>'
	  ].join('');

	  return html;
}
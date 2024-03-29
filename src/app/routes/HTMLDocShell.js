require('dotenv').config();
const config = process.env;

module.exports = function(markup) {
	var html = [
	    '<!DOCTYPE html>',
	    '<html class="no-js" lang="">',
	      '<head>',
	        '<meta charset="utf-8"/>',
	        '<meta http-equiv="X-UA-Compatible" content="IE=edge">',
    		'<title>Hairpiq</title>',
	        '<meta name="description" content="a search engine for people who love hair.">',
	        // <!-- Use minimum-scale=1 to enable GPU rasterization -->
	        '<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0, maximum-scale=1, minimum-scale=1">',
	        // <!-- Google Site Verification -->
	        '<meta name="google-site-verification" content="' + config.GOOGLE_SITE_VERIFICATION + '" />',
	        // <!-- App Link Tagss -->
	        '<link href="/images/favicon.ico" rel="shortcut icon">',
	        '<link rel="stylesheet" href="/css/styles.css"></link>',
	        // <!-- Google Material Icons -->
	        '<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">',
	      '</head>',
	      '<body>',
	       	// <!-- App Markup -->
	        '<div id="app" class="loading">' + markup + '</div>',
	        // <!-- Google Fonts -->
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
		    // <!-- External Scripts -->
	        '<script type="text/javascript" src="https://code.jquery.com/jquery-2.1.1.min.js"></script>',
	        '<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/uikit/2.27.2/js/core/core.js"></script>',
	        '<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/uikit/2.27.2/js/components/accordion.js"></script>',
	        // <!-- Google Analytics -->
	        '<script>',
			  '(function(i,s,o,g,r,a,m){i["GoogleAnalyticsObject"]=r;i[r]=i[r]||function(){',
			  '(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),',
			  'm=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)',
			  '})(window,document,"script","https://www.google-analytics.com/analytics.js","ga");',
			  'ga("create", "UA-77122440-1", "auto");',
			  'ga("send", "pageview");',
			'</script>',
		    // <!-- Drip -->
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
			// <!-- Facebook Api -->
			'<script>',
				'$(document).ready(function() {',
				  '$.getScript("//connect.facebook.net/en_US/sdk.js", function(){',
				    'FB.init({',
				      'appId: "1055815611207867",',
				      'version: "v2.7"', // or v2.1, v2.2, v2.3, ...
				    '});',
				  '});',
				'});',
			'</script>',
			// <!-- Webpack -->
	      	'<script type="text/javascript" src="/app.js"></script>',
	      '</body>',
	    '</html>'
	  ].join('');

	  return html;
}
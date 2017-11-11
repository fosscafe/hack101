reportsApp.service('urlMapperService', function(){
    this.urlMapper = {};
    this.urlMapper.env="prod";
	
    this.urlMapper.brokerUrl = "https://mcaas-prod-api.mybluemix.net/api/v1.0/broker?";
	this.urlMapper.brokerUrl_v2 = "https://mcaas-prod-api.mybluemix.net/api/v2.0/broker?";
	//this.urlMapper.brokerUrl_v3 = "https://mcaas-prod-api.mybluemix.net/api/v3.0/broker?";
	this.urlMapper.brokerUrl_v3 = "https://mcaas-prod-cache-api.mybluemix.net/api/v3.0/broker?";

	//webinar broker
	this.urlMapper.brokerUrlWebinar = "http://mcaas-public-api.mybluemix.net/api/v1.0/broker?";
	
	this.urlMapper.calloutUrl = "https://mcaas-prod-api.mybluemix.net/api/v1.0/vad";
	this.urlMapper.heatmapURL = "https://mcaas-prod-api.mybluemix.net/api/v1.0/visualization?";	
	this.urlMapper.authUrl = "https://mcaas-prod-api.mybluemix.net/api/v2.0/authentication";	

	// Mindfields Redirection URL
	this.urlMapper.upgradetoPremiumURL = 'http://www.mindfields.net.au/premium-report'

	this.urlMapper.urlMaskMapper = "https://mcaas-prod-cache-api.mybluemix.net/api/v1.0/broker/userdetails?";
	this.urlMapper.cacheUrl ="https://mcaas-prod-cache-api.mybluemix.net/api/v1.0/broker/cache";	
	this.urlMapper.conversationsURL = "https://mcaas-icm-prod-conversation-api.mybluemix.net/api/v1.0/conversations?";
	this.urlMapper.quizUrl="http://mcaas-icm-prod-quiz-api.mybluemix.net/api/v1.0/quiz";
	this.urlMapper.quizUrlVisualization="http://mcaas-icm-prod-quiz-api.mybluemix.net/api/v1.0/visualization";

	this.urlMapper.pdfDownloadUrl = "https://mcaas-dev-api.mybluemix.net/api/v1.0/download/pdf";
	this.urlMapper.foresterReportUrl="https://www.forrester.com/go?objectid=";


	
	this.getUrl =function(url){
		return this.urlMapper[url];
	};
	
});
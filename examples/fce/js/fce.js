var Manager;

require.config({
  paths: {
    core: '../core',
    managers: '../managers',
    widgets: '../widgets',
    fce: '../widgets'
  },
  urlArgs: "bust=" +  (new Date()).getTime()
});

(function ($) {

define([
  'managers/Manager.jquery',
  'core/ParameterStore',
  'fce/ResultWidget',
  'fce/TagcloudWidget',
  'fce/CurrentSearchWidget.9',
  'fce/AutocompleteWidget',
  'fce/CountryCodeWidget',
  'fce/CalendarWidget',
  'widgets/jquery/PagerWidget'
], function () {
  $(function () {
    Manager = new AjaxSolr.Manager({
	    solrUrl: 'https://search.forumcivique.org/'
    });
    Manager.addWidget(new AjaxSolr.ResultWidget({
      id: 'result',
      target: '#docs'
    }));
    Manager.addWidget(new AjaxSolr.PagerWidget({
      id: 'pager',
      target: '#pager',
      prevLabel: '&lt;',
      nextLabel: '&gt;',
      innerWindow: 1,
      renderHeader: function (perPage, offset, total) {
        $('#pager-header').html($('<span></span>').text('displaying ' + Math.min(total, offset + 1) + ' to ' + Math.min(total, offset + perPage) + ' of ' + total));
      }
    }));
    var fields = [ 'thema', 'tags', 'kampagne' ];
    for (var i = 0, l = fields.length; i < l; i++) {
      Manager.addWidget(new AjaxSolr.TagcloudWidget({
        id: fields[i],
        target: '#' + fields[i],
        field: fields[i]
      }));
    }
    Manager.addWidget(new AjaxSolr.CurrentSearchWidget({
      id: 'currentsearch',
      target: '#selection'
    }));
    Manager.addWidget(new AjaxSolr.AutocompleteWidget({
      id: 'text',
      target: '#search',
      fields: [ 'title_txt_de', 'body_txt_de', 'author_txt_de' ]
    }));
/*    Manager.addWidget(new AjaxSolr.CountryCodeWidget({
      id: 'countries',
      target: '#countries',
      field: 'countryCodes'
    })); */
    Manager.addWidget(new AjaxSolr.CalendarWidget({
      id: 'calendar',
      target: '#calendar',
      field: 'pub_date'
    }));
    Manager.init();
    Manager.store.addByValue('q', '*:*');
    var params = {
      facet: true,
      'facet.field': [ 'thema', 'tags', 'kampagne' ],
      'facet.limit': 20,
      'facet.mincount': 1,
      'f.topics.facet.limit': 50,
      'defType':'edismax',
      'qf': 'title_txt_de^3 body_txt_de^2 author_txt_de',
      'stopwords': true,
      'facet.range': 'pub_date',
      'facet.range.start': '2009-02-1T00:00:00.000Z/DAY',
      'facet.range.end': '2019-10-31T00:00:00.000Z/DAY',
      'facet.range.gap': '+1MONTH'
    };
    for (var name in params) {
      Manager.store.addByValue(name, params[name]);
    }
    Manager.doRequest();
  });

  $.fn.showIf = function (condition) {
    if (condition) {
      return this.show();
    }
    else {
      return this.hide();
    }
  }
});

})(jQuery);

Vue.component('templates', {
    data: function() {
        return {
            templateList: [
                {snippet: "1", template: "One"},
                {snippet: "2", template: "Two"},
                {snippet: "2021", template: "Two thouthands and twenty one1111111111111"}
            ]
        };
    },
    mounted: function() {
        var list = this.templateList;

        this.$root.$on('set-template', function (snippet, template, prevSnippet) {
            list.push({snippet: snippet, template: template});
        });

        this.$root.$on('remove-template', function (snippet) {
            var index = list.findIndex(elem => elem.snippet === snippet);
            list.splice(index, 1);
        });
    },
    template:
        '<ul class="list-group list-group-flush">' +
            '<template-item v-for="temp in templateList" v-bind:snippet="temp.snippet" ' + 
                'v-bind:key="temp.snippet" v-bind:template="temp.template"></template-item>' +
        '</ul>'
})
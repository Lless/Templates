Vue.component('templates', {
    data: function() {
        return templateList = {};
    },
    mounted: function() {
        var list = this.templateList;

        chrome.storage.sync.get(null, result => {
            this.templateList = result;
            this.$forceUpdate();
        });

        chrome.storage.onChanged.addListener( changes => {
            for (var key in changes) {
                var change = changes[key];
                if (!change.newValue) delete this.templateList[key];
                else this.templateList[key] = change.newValue;
            }
            this.$forceUpdate();
        });
    },
    template:
        '<ul class="list-group list-group-flush">' +
            '<template-item v-for="snippet in Object.keys(templateList)" v-bind:snippet="snippet" ' + 
                'v-bind:key="snippet" v-bind:template="templateList[snippet]"></template-item>' +
        '</ul>'
})
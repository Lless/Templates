Vue.component('templates', {
    data: function() {
        return { 
            templateList: {},
            filterString: ""
        };
    },
    mounted: function() {
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
    methods: {
        filter: function(list) {
            let result = {};
            let filter = this.filterString.toLowerCase();
            for (let key in list) {
                console.log(filter, key, list[key]);
                if (key.toLowerCase().includes(filter) ||
                    list[key].toLowerCase().includes(filter)) 
                    result[key] = list[key];
            }
            return result;
        }
    },
    template:
        '<div class="mt-1">' +
            '<div class="input-group mb-1">' +
                '<div class="input-group-prepend">' +
                    '<img class="input-group-text" src="/img/find24.png"></img>' +
                '</div>'+
                '<input type="text" class="form-control" placeholder="Start typing to filter list" v-model="filterString">' +
            '</div>' +
            '<ul class="list-group list-group-flush">' +
                '<template-item v-for="(template, snippet) in filter(templateList)" v-bind:snippet="snippet" ' + 
                    'v-bind:key="snippet" v-bind:template="template"></template-item>' +
            '</ul>' +
        '</div>'
})
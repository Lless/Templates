Vue.component('template-item', {
    props: ['snippet', 'template'],
    template: '<li class="list-group-item" title="Click to edit" v-on:click="editTemplate">' + 
                    '<span class="badge badge-primary rounded-pill mr-1">' + 
                        '{{snippet}}' + 
                    '</span>' + 
                    '{{template}}' + 
            '</li>',
    methods:  {
        editTemplate: function(){
            this.$root.$emit('set-tab', 'Editor');
            this.$root.$emit('set-editor', this.snippet, this.template);
        }
    }
})

Vue.component('editor', {
    data: function(){
        return {
            prevSnippet : null,
            snippet : null, 
            template : null
        }
    },
    mounted: function() {
        var editor = this;
        this.$root.$on('set-editor', function (snippet, template) {
            editor.prevSnippet = snippet;
            editor.snippet = snippet;
            editor.template = template;
        });
    },
    methods: {
        onSubmit: function(event) {
            this.$root.$emit('set-template', this.snippet, this.template, this.prevSnippet);
            this.onReset();
            //this.$root.$emit('set-tab', "Templates");
            event.preventDefault();
        },
        onRemove: function() {
            this.$root.$emit('set-tab', "Templates");
            this.$root.$emit('remove-template', this.prevSnippet);
            this.onReset();
        },
        onReset: function() {
            Object.assign(this.$data, this.$options.data());
        }
    },
    computed: {
        formSendButtonName: function() {
            if (this.prevSnippet) return "Edit template";
            return "Add template"
        }
    },  
    template: '<form id="editor" class="m-1" v-on:submit="onSubmit">' + 
                    '<div class="form-group row d-flex align-items-center">' +
                        '<label class="col-auto" for="snippet">Snippet:</label>' + 
                        '<input v-model="snippet" type="text" id="snippet" class="form-control col mr-3"' + 
                            'placeholder="New snippet" required>' + 
                    '</div>' +
                    '<textarea v-model="template" class="form-control"' + 
                    'placeholder="New template" required></textarea>' + 
                    '<div class="row m-2 d-flex justify-content-around">' + 
                        '<button type="submit" class="btn btn-primary">{{formSendButtonName}}</button>' +
                        '<button type="button" class="btn btn-primary" v-on:click="onReset">Reset</button>' +
                        '<button type="button" v-if="prevSnippet" class="btn btn-primary" v-on:click="onRemove">Delete</button>' +
                    '</div>' + 
                '</form>',
})

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
    template:'<ul class="list-group list-group-flush">' +
                '<template-item v-for="temp in templateList" v-bind:snippet="temp.snippet" ' + 
                    'v-bind:key="temp.snippet" v-bind:template="temp.template"></template-item>' +
            '</ul>'
})

new Vue({
    el: '#app',
    data: {
        currentTab: 'Templates',
        tabs: ['Templates', 'Editor']
    },
    mounted: function() {
        this.$on('set-tab', function (tab) {
            this.currentTab=tab;
        });
    }
})
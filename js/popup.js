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
            this.$root.$emit('edit-template', this.snippet, this.template);
        }
    }
})

Vue.component('template-editor', {
    data: function(){
        return {
            prevSnippet : null,
            snippet : null, 
            template : null
        }
    },

    mounted: function() {
        var editor = this;
        this.$root.$on('edit-template', function (snippet, template) {
            editor.prevSnippet = snippet;
            editor.snippet = snippet;
            editor.template = template;
        });
    },
    
    methods: {
        onSubmit: function(event) {
            alert("wrong");
            event.preventDefault();
        }
    },
    template: '<form id="editor" v-on:submit="onSubmit">' + 
                    '<input v-model="snippet" type="text" class="form-control" placeholder="New snippet">' + 
                    '<textarea v-model="template" class="form-control" placeholder="New template"></textarea>' + 
                '</form>',
})

new Vue({
    el: '#app',
    data: {
        templates: new Map([
            ["1", "One"],
            ["2","Two"],
            ["2021", "Two thouthands and twenty one1111111111111"]
        ])
    }
})
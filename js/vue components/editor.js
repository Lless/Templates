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
    template: 
        '<form id="editor" class="m-1" v-on:submit="onSubmit">' + 
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
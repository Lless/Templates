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
        document.getElementById('editorTemplateField')
            .addEventListener('input', function () {
                this.style.height = 'auto';
                this.style.height = (this.scrollHeight) + 'px';
            });
    },

    updated: function() {
        var template = document.getElementById("editorTemplateField");
        template.style.height = 'auto';
        template.style.height = (template.scrollHeight) + 'px';
    },

    methods: {
        onSubmit: function(event) {
            event.preventDefault();
            var change = {};
            change[this.snippet] = this.template;
            if (this.prevSnippet && this.prevSnippet == this.snippet) {
                chrome.storage.sync.set(change);
                this.$root.$emit('set-tab', "Templates");
                this.onReset();
                return;
            }
           
            if (this.snippet.match(/\s/)) {
                console.log("snippet should not contain whitespaces, tabs or other space characters")
                return;
            }
            chrome.storage.sync.get(this.snippet, res => {
                if (Object.keys(res).length != 0)  {
                    console.log("snippet in use");
                    return;
                }
                if (this.prevSnippet) chrome.storage.sync.remove(this.prevSnippet);
                chrome.storage.sync.set(change);
                this.$root.$emit('set-tab', "Templates");
                this.onReset();
            })
        },

        onRemove: function() {
            chrome.storage.sync.remove(this.prevSnippet)
            this.$root.$emit('set-tab', "Templates");
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
            '<div class="form-group">' + 
                '<div class="row d-flex align-items-center">' +
                    '<label class="col-auto" for="snippet">Snippet:</label>' + 
                    '<input v-model="snippet" type="text" id="snippet" class="form-control col mr-3"' + 
                        'placeholder="New snippet" required>' + 
                '</div>' +
                '<small v-if="prevSnippet && prevSnippet != snippet" class="form-text text-muted">' +
                    'previous: {{prevSnippet}}'+
                '</small>' +
            '</div>' +
            '<textarea v-model="template" class="form-control"' + 
            'placeholder="New template" id="editorTemplateField" required></textarea>' + 
            '<div class="row m-2 d-flex justify-content-around">' + 
                '<button type="submit" class="btn btn-primary">{{formSendButtonName}}</button>' +
                '<button type="button" class="btn btn-primary" v-on:click="onReset">Reset</button>' +
                '<button type="button" v-if="prevSnippet" class="btn btn-primary" v-on:click="onRemove">Delete</button>' +
            '</div>' + 
        '</form>',
})
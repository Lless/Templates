Vue.component('editor', {
    data: function(){
        return {
            prevSnippet : null,
            snippet : null, 
            template : null,
            invalidSnippetMessage: ""
        }
    },
    mounted: function() {
        let editor = this;
        this.$root.$on('set-editor', function (snippet, template) {
            editor.prevSnippet = snippet;
            editor.snippet = snippet;
            editor.template = template;
        });
    },

    updated: function() {
        let template = this.$refs.templateField;
        template.style.height = 'auto';
        template.style.height = Math.max(template.scrollHeight, 60) + 'px';
    },

    methods: {
        saveTemplate: function(event) {
            event.preventDefault();
            this.$refs.snippetGroup.classList.add("was-validated");
            this.setValidationMessage();
            if (!this.$refs.snippetField.checkValidity()) return;
            this.$refs.templateGroup.classList.add("was-validated");
            if (!this.$refs.templateField.checkValidity()) return;

            if (this.prevSnippet && this.prevSnippet != this.snippet) {
                chrome.storage.sync.remove(this.prevSnippet);
            }

            let change = {};
            change[this.snippet] = this.template;
            chrome.storage.sync.set(change);

            this.$root.$emit('set-tab', "Templates");
            this.resetForm();
        },
        removeTemplate: function() {
            chrome.storage.sync.remove(this.prevSnippet)
            this.$root.$emit('set-tab', "Templates");
            this.resetForm();
        },
        resetForm: function() {
            Object.assign(this.$data, this.$options.data());
            this.$refs.snippetGroup.classList.remove('was-validated');
            this.$refs.templateGroup.classList.remove('was-validated');
        },
        checkSnippetValidity: function() {
            this.$refs.snippetGroup.classList.add('was-validated');
            let snippetField = this.$refs.snippetField;

            if (this.snippet == this.prevSnippet) {
                snippetField.setCustomValidity("");
                this.setValidationMessage();
                return;
            }
            chrome.storage.sync.get(this.snippet, res => {
                if (Object.keys(res).length != 0)  {
                    snippetField.setCustomValidity("Snippet is in use");
                } else snippetField.setCustomValidity("");
                this.setValidationMessage()
            })
        },
        setTemplateFieldLength: function() {
            this.$refs.templateGroup.classList.add('was-validated');
            this.$refs.templateField.style.height = 'auto';
            this.$refs.templateField.style.height = (this.$refs.templateField.scrollHeight) + 'px';
        },
        setValidationMessage: function(){
            let validity = this.$refs.snippetField.validity;
            this.invalidSnippetMessage = 
                validity.valueMissing ? "Snippet should not be empty" :
                validity.patternMismatch ? "Snippet should not contain whitespaces or other space characters" :
                this.$refs.snippetField.validationMessage;
        }
    },
    computed: {
        formSendButtonName: function() {
            return this.prevSnippet ?  "Edit template" : "Add template";
        }
    },  
    template: 
        '<form id="editor" class="m-1" v-on:submit="saveTemplate" novalidate>' + 
            '<div class="form-group input-group" ref="snippetGroup" id="editorSnippetGroup">' + 
                '<div class="input-group-prepend">' +
                    '<div class="col-auto input-group-text" for="editorSnippetField">Snippet</div>' +
                '</div>' +
                '<input v-model="snippet" type="text" id="editorSnippetField" ref="snippetField" placeholder="New snippet"' + 
                    'class="form-control col" required v-on:input="checkSnippetValidity" pattern="\\S+">' +  
                '<div class="invalid-feedback">' +
                    '{{invalidSnippetMessage}}' +
                '</div>' +
                '<small v-if="prevSnippet && prevSnippet != snippet" class="form-text text-muted">' +
                    'previous: {{prevSnippet}}'+
                '</small>' +
            '</div>' +
            '<div ref="templateGroup" class="form-group">' +
                '<textarea v-model="template" class="form-control" ref="templateField" placeholder="New template"' + 
                    'required v-on:input="setTemplateFieldLength"></textarea>' + 
                '<div class="invalid-feedback">Template should not be empty</div>' +
            '</div>' +
            '<div class="row m-2 d-flex justify-content-between">' + 
                '<button type="submit" class="btn m-2 btn-primary">{{formSendButtonName}}</button>' +
                '<button type="button" v-if="prevSnippet" class="btn btn-primary m-2" v-on:click="removeTemplate">' + 
                    'Delete template</button>' +
                '<button type="button" class="btn btn-primary m-2" v-on:click="resetForm">Reset form</button>' +
            '</div>' + 
        '</form>',
})
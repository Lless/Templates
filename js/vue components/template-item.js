Vue.component('template-item', {
    props: ['snippet', 'template'],
    template: 
        '<li class="list-group-item list-group-item-action" title="Click to edit" v-on:click="editTemplate">' + 
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
grunt.loadNpmTasks('grunt-grunticon');


grunticon: {
    myIcons: {
        files: [{
            expand: true,
            cwd: 'example/source',
            src: ['*.svg', '*.png'],
            dest: "example/output"
        }],
            options: {
        }
    }
}
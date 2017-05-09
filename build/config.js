/**
 * @author hefeng
 * @date 2015/12/24
 * @description 前端项目(assets)配置文件
 */
(function(rjs){
    //域名配置属性
    var domain = rjs('../lib/domain');

    module.exports = {
        /******** 公共配置 ********/
        'rjs.baseUrl': './',
        'res.baseUrl': domain.url,

        // 打包过程会直接拷贝webapp下的某些目录
        // 这里配置排除已经复制的目录
        excludeFolder: ['assets', 'app', 'onestation', 'third-party'],

        /******** 前端框架 ********/
        fwk: {
            // APP根目录
            srcRoot: '../../path/to/src/main/webapp',

            // APP输出根目录
            distRoot: '../../path/to/src/main/webapp-dist',

            // 压缩后的模板文件名
            allTplFileName: 'fwk-tpl.all.js',

            // 静态资源路径配置
            paths: {
                requireMainFile: 'assets/scripts/require-main',
                allTplFile: 'assets/scripts/fwk-tpl.all',
                tpl: ['assets/**/*.tpl'],
                plugins: {
                    dist: 'assets/scripts/plugins',
                    css: 'assets/scripts/plugins/**/*.css',
                    js: 'assets/scripts/plugins/**/*.js',
                    images: 'assets/scripts/plugins/**/*.{png,jpg,jpeg,gif}'
                },
                images: [
                    'assets/**/images/**',
                    '!assets/images/**',
                    '!assets/scripts/plugins/**/images/**'
                ],
                js: [
                    'assets/scripts/**/*.js',
                    '!assets/scripts/*-dev.js',
                    '!assets/scripts/require-main.js',
                    '!assets/scripts/plugins/**/*.js'
                ]
            },

            // 目标输出路径
            dests: {
                images: 'assets/css/images',
                css: 'assets/css',
                js: 'assets/scripts',
                tpl: 'assets/scripts'
            },

            // 打包不全的部分文件另外复制
            copyTask: [
                {src:'assets/fonts/**', dest:'assets/fonts'},
                {src:'assets/images/**', dest:'assets/images'},
                {src:'third-party/**', dest:'third-party'},
                {src:'youworthit.html', dest:'./'},
                {src:'favicon.ico', dest:'./'}
            ]
        },

        /******** 模块配置 ********/
        module: {
            // 项目根目录
            srcRoot: '',

            // 项目输出根目录
            distRoot: '',

            // APP根目录
            appDir: 'app',

            // 模块的根路径
            baseUrl: 'app/<%=moduleName%>',

            // 压缩后的模板文件名
            allTplFileName: 'module-tpl.all.js',

            // 模块源路径
            paths: {
                requireMainFile: 'app/<%=moduleName%>/module-main',
                js: ['app/**/*.js', '!app/**/module-*.js'],
                tpl: ['app/**/*.tpl']
            },

            // 运营管理
            demo: {
                srcRoot: '../../path/to/src/main/webapp',
                distRoot: '../../path/to/src/main/webapp-dist'
            }
        }
    };
})(require);
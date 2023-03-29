export default function myPlugin() {
    return {
        name: 'my-plugin',
        resolveId(source) {
            console.log('====================================');
            console.log(source, '看看 source');
            console.log('====================================');
            return null;
        },
        load(id) {
            console.log('id:  ', id);
            // return 'console.log()';
        },
    };
}

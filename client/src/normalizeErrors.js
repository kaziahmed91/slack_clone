
// [{path: '', message: ''}] ->   { email: ['err1', 'err2']}
    export default (errors) => {
        return errors.reduce((acc, curr) => {
            if (curr.path in acc) {
                acc[curr.path].push(curr.message)
            } else {
                acc[curr.path] = [curr.message]; 
            }
            return acc;
        }, {} )
    }

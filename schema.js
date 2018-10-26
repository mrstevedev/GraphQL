const axios = require('axios');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');

// Harcoded Data 
// const customers = [
//     {id: 1, name: 'Aubrey Plaza', email: 'aubreyplaza@gmail.com', age: 33},
//     {id: 2, name: 'Jay Gordon', email: 'jgordon@gmail.com', age: 31},
//     {id: 3, name: 'John Doe', email: 'jdoe@gmail.com', age: 35},
// ]

// Customer Type 
const PersonType = new GraphQLObjectType({
    name: 'Person',
    fields: () => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        age: {type: GraphQLInt}
    })
}); 

// Root Query 
const RootQuery = new GraphQLObjectType({
    // All Object Types Need a Name 
    name: 'RootQueryType',
    fields: {
        person: {
            type: PersonType,
            args: {
                id: {type: GraphQLString}
            },
            resolve(parentValue, args) {                        
                /*
                for(let i = 0; i < customers.length; i++) {
                    if(customers[i].id == args.id) {
                        return customers[i];
                    }
                }
                */
               return axios.get('http://localhost:3000/people/'+args.id)
                    .then(res => res.data)
            }
        },
        people: {
            type: new GraphQLList(PersonType),
            resolve(parentValue, args) {
                return axios.get('http://localhost:3000/people/')
                    .then(res => res.data)
            }
        }
    }
});

// Mutations
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addPerson: {
            type: PersonType,
            args:{
                name: {type: new GraphQLNonNull(GraphQLString)},
                email: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull(GraphQLInt)}           
            },
            resolve(parentValue, args){
                return axios.post('http://localhost:3000/people', {
                    name:args.name, 
                    email:args.email, 
                    age:args.age
                })
                .then(res => res.data)
            }
        },
        editPerson: {
            type: PersonType,
            args:{
                id: {type: new GraphQLNonNull(GraphQLString)},
                name: {type: GraphQLString},
                email: {type: GraphQLString},
                age: {type: GraphQLInt}           
            },
            resolve(parentValue, args){
                return axios.patch('http://localhost:3000/people/'+args.id, args)
                    .then(res => res.data)
            }
        },
        deletePerson: {
            type: PersonType,
            args:{
                id: {type: new GraphQLNonNull(GraphQLString)}         
            },
            resolve(parentValue, args){
                return axios.delete('http://localhost:3000/people/'+args.id)
                .then(res => res.data)
            }
        }
    }
})

module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation: mutation
});
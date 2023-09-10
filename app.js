
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import fetch from "node-fetch"
import './drivers/db.js'
import mCountry from "./models/country.js";


const typeDefs = `
type Country {
    _id: String
    nameCommon: String
    nameOfficial: String
    independent: Boolean
    capital:String
    region: String
    coatOfArms: String
    flags: String
    alt: String
}
type Query {
    obtainAllCountryApi: [Country]
    findByIdDb(id: String!): Country
    obtainAllCountryDb: [Country]
}
type Mutation {
    addCountryDb(
        nameCommon: String!, 
        nameOfficial: String!, 
        independent: Boolean!, 
        capital: String!,
        region: String!, 
        coatOfArms: String!,
        flags: String!,
        alt: String!): Country

        deleteCountryDb(id: String!): Country

        modifyCountryDb(
        id: String!,
        nameCommon: String!,
        nameOfficial: String!, 
        independent: Boolean!, 
        capital: String!,
        region: String!, 
        coatOfArms: String!,
        flags: String!,
        alt: String!,
        ): Country
    }
`;

const obtainAllCountry = async (parent, args, contextValue, info) => {
    const urlApi = `https://restcountries.com/v3.1/all`
    const response = await fetch(urlApi);
    const countryData = await response.json();
    //console.log(countryData)
    const mappedCountries = []
    for (let i = 0; i < countryData.length; i++) {
        const mappedCountry = {
            nameCommon: countryData[i].name.common,
            nameOfficial: countryData[i].name.official,
            independent: countryData[i].independent,
            capital: countryData[i].capital && countryData[i].capital.length > 0 ? countryData[i].capital[0] : "N/A",
            region: countryData[i].region,
            coatOfArms: countryData[i].coatOfArms.svg,
            flags: countryData[i].flags.svg,
            alt: countryData[i].flags.alt
        }
        mappedCountries.push(mappedCountry)
    }
    //console.log(mappedCountries)
    return mappedCountries
}

const findByIdDb= async (parent, args, contextValue, info) => {
    //console.log(args);
        const dataCountry = await mCountry.findById(args.id)
    //console.log(dataCountry);
        return dataCountry;
};

const addCountrydb = async(parent, args, contextValue, info) => {
    // console.log(args);
    const { nameCommon, nameOfficial, independent, capital, region, coatOfArms, flags, alt } = args
    //console.log(nameCommon, nameOfficial, independent, capital, region, coatOfArms, flags, alt);
    const country = new mCountry(args)
    return  await country.save()
}

const obtainAllDb = async () => {
    return await mCountry.find()
};

const deleteCountry = async (parent, args, contextValue, info) => {
    const id = args.id
    // console.log(args)
    const response = await mCountry.findByIdAndDelete(id).exec()
   // console.log(response);
    return response
}

const modifyCountry = async (parent, args, contextValue, info) => {
    const id = args.id;
    //console.log(args);
    try {
        const updatedCountry = await mCountry.findByIdAndUpdate(id, {
            nameCommon: args.nameCommon,
            nameOfficial: args.nameOfficial,
            independent: args.independent,
            capital: args.capital,
            region: args.region,
            coatOfArms: args.coatOfArms,
            flags : args.flags,
            alt: args.alt
        });
      //  console.log(updatedCountry);
        return updatedCountry
    } catch (error) {
        console.log(error.message)
    }
}


const Resolvers = {
    Query: {
        obtainAllCountryApi: obtainAllCountry,
        obtainAllCountryDb: obtainAllDb,
        findByIdDb: findByIdDb
    },
    Mutation: {
        addCountryDb: addCountrydb,
        deleteCountryDb: deleteCountry,
        modifyCountryDb: modifyCountry
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers: Resolvers,
});

const { url } = await startStandaloneServer(server, {
    listen: { port: 4005 },
});

console.log(`Server ready at port ${url}`);

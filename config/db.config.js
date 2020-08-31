module.exports={
    // Use below command to start docker-compose container
    // HOST:'host.docker.internal',
    HOST:'localhost',
    USER:'postgres',
    PASSWORD:'postgres',
    DB:'auth_system',
    dialect:'postgres',
    pool:{
        max:5,
        min:0,
        accquire:30000,
        idle:10000
    }
}
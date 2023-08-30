import React from "react";
import { DatabaseCard } from "./cards/Database";
import { CacheCard } from "./cards/CacheCard";


const ServerConfiguration: React.FC = () => {
    return (
        <>
            <DatabaseCard />
            <CacheCard />
        </>
    )
}
export default ServerConfiguration;

async function getDefaultGateway() {
    try {
        const { gateway4sync } = await import("default-gateway");
        const { gateway } = gateway4sync();
        return gateway;
    } catch (error) {
        console.error(`An error occurred while importing default-gateway: ${error}`);
        throw new Error('default-gateway error');
    }
}

export { getDefaultGateway };

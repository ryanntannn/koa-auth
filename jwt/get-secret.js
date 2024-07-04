

module.exports = async (provider, token, decode) => {
    const decoded = await decode(token);

    if (!decoded || !decoded.header) {
        throw new Error('Invalid token');
    }

    return provider(decoded.header, decoded.payload);
};

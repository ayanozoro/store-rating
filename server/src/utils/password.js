import bcrypt from 'bcryptjs'

const salt_round = 10;

const hashPassword = async (password) => {
    const newhashpassword = await bcrypt.hash(password, salt_round);
    return newhashpassword;
}

const comparePassword = async (password, hashPassword) => {
    if (!password || !hashPassword) return false;
    return bcrypt.compare(password, hashPassword);
}

export { hashPassword, comparePassword };
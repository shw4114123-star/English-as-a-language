import bcrypt from 'bcrypt';

export async function passwordHash(password) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

export async function comparePassword(password, hash) {
    const isMatch = await bcrypt.compare(password, hash);
    return isMatch;
}

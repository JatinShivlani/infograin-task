import { NextResponse } from 'next/server';

const authAdmin = async (userId) => {
    try {

// we will check if the user is an valid admin or not
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message });
    }
}

export default authAdmin;
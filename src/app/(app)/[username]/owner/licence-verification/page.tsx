"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function LicenseVerificationPage() {

    const [users, setUsers] = useState<any[]>([]);

    useEffect(() => {
        axios
            .get("/api/license-verification")
            .then((res) => setUsers(res.data.users));
    }, []);

    const approve = async (id: number) => {

        await axios.put(`/api/license-verification/${id}`, {
            status: "APPROVED",
        });

        const res = await axios.get("/api/license-verification");
        setUsers(res.data.users);
    };
    const reject = async (id: number) => {

        await axios.put(`/api/license-verification/${id}`, {
            status: "REJECTED",
        });

        const res = await axios.get("/api/license-verification");
        setUsers(res.data.users);
    };

    return (
        <div className="max-w-6xl mx-auto p-6">

            <h1 className="text-3xl font-bold mb-6">
                Driving Licence Verification
            </h1>

            {
                users.length === 0 ? (

                    <p>No licence uploads found.</p>

                ) : (

                    users.map((user) => (

                        <div
                            key={user.id}
                            className="border rounded-xl shadow-md p-5 mb-8 bg-white"
                        >

                            <h2 className="text-xl font-semibold">
                                {user.fullName}
                            </h2>

                            <p>
                                <strong>Username:</strong> {user.username}
                            </p>

                            <p>
                                <strong>Email:</strong> {user.email}
                            </p>

                            <p>
                                <strong>Licence Number:</strong> {user.licenseNumber}
                            </p>

                            <p>
                                <strong>Status:</strong> {user.licenseStatus}
                            </p>
                            
                            <div className="flex gap-6 mt-5">

                            <div>

                                <p className="font-semibold mb-2">
                                    Front Side
                                </p>

                                <img
                                    src={user.licenseFrontUrl}
                                    alt="Front Licence"
                                    className="w-72 h-48 object-cover rounded border"
                                />

                            </div>

                            <div>

                                <p className="font-semibold mb-2">
                                    Back Side
                                </p>

                                <img
                                    src={user.licenseBackUrl}
                                    alt="Back Licence"
                                    className="w-72 h-48 object-cover rounded border"
                                />

                            </div>

                            </div>

                            <div className="flex gap-4 mt-6">

                                <button
                                    onClick={() => approve(user.id)}
                                    className="bg-green-600 text-white px-5 py-2 rounded"
                                >
                                    Approve
                                </button>

                                <button
                                    onClick={() => reject(user.id)}
                                    className="bg-red-600 text-white px-5 py-2 rounded"
                                >
                                    Reject
                                </button>

                            </div>

                        </div>

                    ))

                )
            }

        </div>
    );
}
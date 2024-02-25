import { useQuery, useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { UserType } from "../../../backend/src/shared/types";

const Users = () => {
    const queryClient = useQueryClient();
    const { data: userData } = useQuery<UserType[]>("loadUsers", apiClient.loadUsers);

    const blockUser = useMutation<void, Error, string>(apiClient.blockUser, {
        onSuccess: () => {
            queryClient.invalidateQueries("loadUsers");
        }
    });

    const unblockUser = useMutation<void, Error, string>(apiClient.unblockUser, {
        onSuccess: () => {
            queryClient.invalidateQueries("loadUsers");
        }
    });

    const handleBlock = async (userId: string) => {
        await blockUser.mutateAsync(userId);
    };

    const handleUnblock = async (userId: string) => {
        await unblockUser.mutateAsync(userId);
    };

    if (!userData) {
        return <span>No users in the list</span>;
    }

    return (
        <div className="grid grid-cols">
            <table className="table-fixed border">
                <thead className="border">
                    <tr className="border">
                        <th className="border">Name</th>
                        <th className="border">Email</th>
                        <th className="border">Mobile</th>
                        <th className="border">Status</th>
                        <th className="border">Action</th>
                    </tr>
                </thead>
                <tbody className="border m-2 p-2 text-center">
                    {userData.map((user, index) => (
                        <tr key={index} className="border">
                            <td className="border m-2 p-2 text-center">{`${user.firstName} ${user.lastName}`}</td>
                            <td className="border m-2 p-2 text-center">{user.email}</td>
                            <td className="border m-2 p-2 text-center">{user.mobile}</td>
                            <td className="border m-2 p-2 text-center">{user.isBlocked ? "Blocked" : "Active"}</td>
                            <td className="border m-2 p-2 text-center">
                                {user.isBlocked ? (
                                    <button
                                        onClick={() => handleUnblock(user._id)}
                                        className="w-100 bg-blue-600 text-white h-full p-2 font-bold text-xl hover:bg-blue-500"
                                    >
                                        Unblock
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => handleBlock(user._id)}
                                        className="w-100 bg-red-600 text-white h-full p-2 font-bold text-xl hover:bg-red-500"
                                    >
                                        Block
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Users;

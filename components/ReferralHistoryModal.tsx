'use client';

import { getReferralDetails } from "@/lib/actions/user.actions";
import { Button } from "@react-email/components";
import { CircleX } from "lucide-react";
import { useState, useEffect } from "react";

interface ReferralHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

interface ReferralDetails {
  referrals: {
    id: string;
    firstname: string;
    lastname: string;
    date: string;
    isPaid: boolean;
    earnings: number;
  }[];
  totalPoints: number;
  totalEarnings: number;
}

export const ReferralHistoryModal = ({
  isOpen,
  onClose,
  userId,
}: ReferralHistoryModalProps) => {
  const [referralDetails, setReferralDetails] =
    useState<ReferralDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadReferralDetails = async () => {
      try {
        setLoading(true);
        const details = await getReferralDetails(userId);
        setReferralDetails(details);
      } catch (error) {
        console.error("Error loading referral details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isOpen && userId) {
      loadReferralDetails();
    }
  }, [isOpen, userId]);

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4">
        <div className="bg-white w-full max-w-3xl max-h-[80vh] rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-green-800 text-center">
              Referral History
            </h2>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 p-6 bg-gray-50">
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Total Points</p>
              <p className="text-2xl font-bold text-green-800">
                {referralDetails?.totalPoints || 0}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Total Earnings</p>
              <p className="text-2xl font-bold text-green-800">
                {(referralDetails?.totalEarnings || 0).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Table Section */}
          <div className="p-6 pt-0">
            {loading ? (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-800"></div>
              </div>
            ) : (
              <div className="overflow-x-auto max-h-64 overflow-y-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 border-b border-gray-200 sticky top-0 bg-gray-50">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-600 border-b border-gray-200 sticky top-0 bg-gray-50">
                        Status
                      </th>
                      <th className="px-4 py-3 text-right text-sm font-semibold text-gray-600 border-b border-gray-200 sticky top-0 bg-gray-50">
                        Earnings
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {referralDetails?.referrals.map((referral) => (
                      <tr
                        key={referral.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center text-green-800 font-semibold mr-3">
                              {referral.firstname[0]}
                              {referral.lastname[0]}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">
                                {referral.firstname} {referral.lastname}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(referral.date).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            referral.isPaid 
                              ? "bg-green-100 text-green-800" 
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {referral.isPaid ? "Paid" : "Pending"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-sm font-medium text-gray-900">
                          {(referral.earnings || 0).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {referralDetails?.referrals.length === 0 && (
                  <div className="text-center py-12">
                    <p className="text-gray-500">No referrals yet</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex justify-end">
              <Button
                onClick={onClose}
                className="bg-green-600 hover:bg-green-700 text-white shadow-sm py-2 px-4 rounded-full"
              >
                <CircleX />
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  );
};
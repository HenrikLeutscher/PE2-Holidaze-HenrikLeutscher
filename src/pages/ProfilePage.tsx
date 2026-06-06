import { Link } from "react-router";
import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import { Loading } from "../components/ui/Loading";
import {
  ProfileBookings,
  ProfileVenueUpcomingBookings,
} from "../components/profile/ProfileBookings";
import { ProfileVenues } from "../components/profile/ProfileVenues";
import { Button } from "../components/ui/Button";
import type { Profile } from "../types/profile";
import { EditProfileForm } from "../components/profile/EditProfileForm";

export function ProfilePage() {
  const { user, token } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    document.title = "Profile | Holidaze";
    if (!token) return;

    const fetchProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `https://v2.api.noroff.dev/holidaze/profiles/${user?.name}?_venues=true&_bookings=true`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              "X-Noroff-API-Key": import.meta.env.VITE_API_KEY,
            },
          },
        );

        if (response.status === 403) {
          throw new Error(
            "Unauthorized access. Please ensure your API Token is valid.",
          );
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch profile: ${response.status}`);
        }

        const data = await response.json();
        setProfile(data.data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [token]);

  if (!token) {
    return (
      <div className="text-center my-auto font-bold">
        <p>
          You must be logged in to view this page. Please{" "}
          <Link to="/login" className="text-primary hover:underline">
            log in here
          </Link>{" "}
          to access your profile.
        </p>
      </div>
    );
  }

  if (error) {
    return <p className="text-red-500 mx-auto my-auto text-header3">{error}</p>;
  }

  if (loading) return <Loading />;
  if (error) return <p className="text-center text-red-500 my-auto">{error}</p>;

  return (
    <div className="mx-auto w-[80%] my-auto container justify-center items-center flex flex-col gap-5 py-5">
      <h1 className="text-header1">{profile?.name}'s Profile Page</h1>
      <div className="flex flex-col lg:flex-row items-start gap-10">
        {/* Profile Left Column */}
        <div className="flex top-0 flex-col items-center border-primary border-2 rounded-2xl w-full lg:w-1/3 py-8 gap-2 text-center">
          <img
            src={profile?.avatar?.url}
            alt={`${profile?.name}'s avatar`}
            className="h-full w-1/2 rounded-full"
          />
          <p>{profile?.name}</p>
          <p>{profile?.email}</p>
          {profile?.venueManager && (
            <p className="text-sm italic">Venue Manager</p>
          )}
          <p>
            <span className="font-bold">Bio:</span> <br></br>
            {profile?.bio || "No bio available"}
          </p>
          <Button
            text={showEditForm ? "Cancel" : "Edit Profile"}
            onClick={() => setShowEditForm(!showEditForm)}
            type="submit"
            disabled={loading || isDisabled}
            loading={loading}
          />
          {showEditForm && (
            <div>
              <EditProfileForm profile={profile} />
            </div>
          )}
        </div>
        {/* Profile Right Column */}
        <div className="border-primary border-2 rounded-2xl flex flex-col items-center justify-center lg:w-2/3 gap-10 py-20 p-10">
          <img
            src={profile?.banner?.url}
            alt={`${profile?.name}'s banner`}
            className="w-auto h-40 rounded-2xl"
          />
          <ProfileBookings />

          {user?.venueManager && (
            <>
              <ProfileVenues />
              <ProfileVenueUpcomingBookings />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

import { useSignIn } from "@clerk/expo";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator,
    Image,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export default function SignUp() {
  const { signIn, errors, fetchStatus } = useSignIn();

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [showVerifier, setShowVerifier] = useState(false);
  const [verificationFactor, setVerificationFactor] = useState<
    "email_code" | "phone_code" | null
  >(null);

  const isLoading = fetchStatus === "fetching";

  const finalizeSignIn = async () => {
    await signIn.finalize({
      navigate: ({ session, decorateUrl }) => {
        if (session?.currentTask) {
          console.log(session?.currentTask);
          return;
        }
        const url = decorateUrl("/");
        router.replace(url as any);
      },
    });
  };

  const onVerifyPress = async () => {
    if (verificationFactor === "phone_code") {
      await signIn.mfa.verifyPhoneCode({ code });
    } else if (verificationFactor === "email_code") {
      await signIn.mfa.verifyEmailCode({ code });
    }

    if (signIn.status === "complete") {
      await finalizeSignIn();
    }
  };

  const onResendCode = async () => {
    if (verificationFactor === "phone_code") {
      await signIn.mfa.sendPhoneCode();
    } else if (verificationFactor === "email_code") {
      await signIn.mfa.sendEmailCode();
    }
  };

  const onSignInPress = async () => {
    const { error } = await signIn.password({
      emailAddress: email,
      password,
    });

    if (error) {
      console.error(JSON.stringify(error.message, null, 2));
      alert(error.message);
      return;
    }

    if (signIn.status === "complete") {
      await finalizeSignIn();
    } else if (signIn.status === "needs_second_factor") {
      const phoneFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "phone_code",
      );
      if (phoneFactor) {
        await signIn.mfa.sendPhoneCode();
        setVerificationFactor("phone_code");
        setShowVerifier(true);
      }
    } else if (signIn.status === "needs_client_trust") {
      const emailCodeFactor = signIn.supportedSecondFactors.find(
        (factor) => factor.strategy === "email_code",
      );
      if (emailCodeFactor) {
        await signIn.mfa.sendEmailCode();
        setVerificationFactor("email_code");
        setShowVerifier(true);
      }
    } else {
      console.error("Sign in attempt not completed:", signIn);
    }
  };

  if (showVerifier && verificationFactor) {
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="bg-white"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-6 py-12">
          <Image
            source={require("../../assets/images/kribb.png")}
            className="w-32 h-16 mb-8"
            resizeMode="contain"
          />
          <Text className="text-3xl font-bold text-gray-800 mb-2">
            Verify Your Account
          </Text>
          <Text className="text-gray-500 mb-8">
            {verificationFactor === "phone_code"
              ? "We sent a code to your phone"
              : `We sent a code to ${email}`}
          </Text>
          <TextInput
            className="flex-1 border border-gray-300 rounded-xl px-4 py-3"
            placeholder="Enter verification code"
            placeholderTextColor={"#9CA3AF"}
            value={code}
            keyboardType="number-pad"
            onChangeText={setCode}
          />
          {errors.fields.code && (
            <Text className="text-red-500 mb-4">
              {errors.fields.code.message}
            </Text>
          )}

          <TouchableOpacity
            onPress={onVerifyPress}
            disabled={isLoading}
            className="bg-blue-500 py-4 rounded-md items-center mb-4"
          >
            {isLoading ? (
              <ActivityIndicator color={"white"} />
            ) : (
              <Text className="text-white font-bold text-base">Verify</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={onResendCode} className="py-2">
            <Text className="text-blue-600">I need a new code</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-white"
      keyboardShouldPersistTaps="handled"
    >
      <View className="flex-1 justify-center px-6 py-12">
        <Image
          source={require("../../assets/images/kribb.png")}
          className="w-32 h-16 mb-8"
          resizeMode="contain"
        />
        <Text className="text-3xl font-bold text-gray-800 mb-2">
          Welcome Back!
        </Text>
        <Text className="text-gray-500 mb-8">
          Sign In and continue finding your dream home
        </Text>
        <TextInput
          className="flex-1 border border-gray-300 rounded-xl px-4 py-3"
          placeholder="Email Address"
          placeholderTextColor={"#9CA3AF"}
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        {errors.fields.identifier && (
          <Text className="text-red-500 mb-4">
            {errors.fields.identifier.message}
          </Text>
        )}
        <TextInput
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-6"
          placeholder="Password"
          placeholderTextColor={"#9CA3AF"}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {errors.fields.password && (
          <Text className="text-red-500 mb-4">
            {errors.fields.password.message}
          </Text>
        )}

        <TouchableOpacity
          onPress={onSignInPress}
          disabled={isLoading}
          className="bg-blue-500 py-4 rounded-md items-center mb-4"
        >
          {isLoading ? (
            <ActivityIndicator color={"white"} />
          ) : (
            <Text className="text-white font-bold text-base">Sign In</Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center">
          <Text className="text-gray-500">Don&apos;t have an account? </Text>
          <Link href={"/sign-up"}>
            <Text className="text-blue-600 font-semibold">Sign Up</Text>
          </Link>
        </View>

        <View nativeID="clerk-captcha" />
      </View>
    </ScrollView>
  );
}

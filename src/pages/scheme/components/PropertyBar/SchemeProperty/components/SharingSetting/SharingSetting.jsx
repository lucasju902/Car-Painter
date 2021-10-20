import React, { useMemo } from "react";
import { Formik } from "formik";

import { InnerForm } from "./InnerForm";

export const SharingSetting = React.memo((props) => {
  const {
    editable,
    owner,
    currentUser,
    schemeID,
    sharedUsers,
    onCancel,
    onApply,
  } = props;

  const initialValues = useMemo(
    () => ({
      newUser: null,
      sharedUsers: sharedUsers,
    }),
    [sharedUsers]
  );

  return (
    <Formik
      initialValues={initialValues}
      enableReinitialize
      // validationSchema={Yup.object().shape({
      //   user_id: Yup.number().min(0),
      // })}
      validate={(values) => {
        return {};
      }}
      onSubmit={onApply}
    >
      {(formProps) => (
        <InnerForm
          {...formProps}
          editable={editable}
          owner={owner}
          currentUserID={currentUser.id}
          schemeID={schemeID}
          onCancel={onCancel}
        />
      )}
    </Formik>
  );
});

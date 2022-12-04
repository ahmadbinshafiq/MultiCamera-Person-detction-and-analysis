def compare_age_tracker(new_tracker, prev_tracker):
    # get all the keys in the new tracker and the previous tracker
    new_keys = list(new_tracker.keys())
    prev_keys = list(prev_tracker.keys())

    # check if the prev tracker has any keys that are not in the new tracker
    # TODO: take this code into the main
    unique_keys = list(set(prev_keys) - set(new_keys))
    if len(unique_keys) > 0:
        for key in unique_keys:
            print(f"pushing {key} - {prev_tracker[key]} to db...")  # push this key value pair to the database

    # check if the new tracker has any keys which values are different from the previous tracker
    for key in new_keys:
        if key in prev_keys:
            if new_tracker[key] != prev_tracker[key] and new_tracker[key] == [None, None]:
                new_tracker[key] = prev_tracker[key]

    track_dict = {}
    for key in new_keys:
        track_dict[key] = new_tracker[key]

    return track_dict


def counts(tracker):
    total_people = len(tracker)
    male_count, female_count, unknown_count = 0, 0, 0
    child_count, teen_count, adult_count, elderly_count = 0, 0, 0, 0
    for track in tracker:
        if tracker[track][1] == 'MALE':
            male_count += 1
        elif tracker[track][1] == 'FEMALE':
            female_count += 1
        else:
            unknown_count += 1

        if tracker[track][0] is not None:
            if tracker[track][0] <= 12:
                child_count += 1
            elif tracker[track][0] <= 19:
                teen_count += 1
            elif tracker[track][0] <= 60:
                adult_count += 1
            elif tracker[track][0] > 60:
                elderly_count += 1

    data = {
        'total_people': total_people,
        'male_count': male_count,
        'female_count': female_count,
        'unknown_count': unknown_count,
        'child_count': child_count,
        'teen_count': teen_count,
        'adult_count': adult_count,
        'elderly_count': elderly_count
    }

    return data


